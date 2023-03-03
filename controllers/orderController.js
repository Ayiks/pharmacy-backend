const { validationResult } = require('express-validator');
const db = require('../config/db');
const Order = require('../models/order');
const Product = require('../models/product');

exports.createOrder = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { products } = req.body;

  try {
    // Start transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    // Create order
    const order = new Order({
      userId: req.user.id,
      totalQuantity: 0,
      totalPrice: 0
    });
    const { insertId } = await order.save(connection);

    // Loop through products and create order details
    for (const product of products) {
      const { productId, quantity } = product;

      // Get product from database
      const [rows, fields] = await connection.execute(
        'SELECT * FROM products WHERE id = ?',
        [productId]
      );
      const [fetchedProduct] = rows;

      // Check if product exists
      if (!fetchedProduct) {
        await connection.rollback();
        return res.status(400).json({ msg: 'Product not found' });
      }

      // Check if product has enough quantity
      if (fetchedProduct.quantity < quantity) {
        await connection.rollback();
        return res.status(400).json({ msg: 'Not enough quantity' });
      }

      // Create order detail
      const orderDetail = {
        orderId: insertId,
        productId: fetchedProduct.id,
        quantity
      };
      await connection.execute(
        'INSERT INTO order_details SET ?',
        orderDetail
      );

      // Update product quantity
      fetchedProduct.quantity -= quantity;
      await Product.update(connection, productId, {
        quantity: fetchedProduct.quantity
      });

      // Update order total quantity and price
      order.totalQuantity += quantity;
      order.totalPrice += fetchedProduct.selling_price * quantity;
    }

    // Update order with total quantity and price
    await Order.update(connection, insertId, {
      totalQuantity: order.totalQuantity,
      totalPrice: order.totalPrice
    });

    // Commit transaction
    await connection.commit();

    // Send response
    const response = {
      msg: 'Order created successfully',
      order: {
        id: insertId,
        userId: order.userId,
        totalQuantity: order.totalQuantity,
        totalPrice: order.totalPrice,
        orderDetails: products
      }
    };
    req.app.get('socketio').emit('order', response);
    return res.status(201).json(response);
  } catch (error) {
    console.log(`Error creating order: ${error.message}`);
    await connection.rollback();
    return res.status(500).json({ msg: 'Server error' });
  } finally {
    await connection.release();
  }
};
