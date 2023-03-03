const db = require('../config/db');


const createOrder = async (userId, products) => {
    let order;
    let connection;
  
    try {
      connection = await db.getConnection();
  
      await connection.beginTransaction();
  
      // Calculate the total quantity and price for the order
      let totalQuantity = 0;
      let totalPrice = 0;
      for (let i = 0; i < products.length; i++) {
        totalQuantity += products[i].quantity;
        totalPrice += products[i].selling_price * products[i].quantity;
      }
  
      // Insert the order into the orders table
      const orderQuery = `
        INSERT INTO orders (user_id, total_quantity, total_price)
        VALUES (?, ?, ?)
      `;
      const orderParams = [userId, totalQuantity, totalPrice];
      const [orderResult] = await connection.execute(orderQuery, orderParams);
      const orderId = orderResult.insertId;
  
      // Insert the order details into the order_details table
      const orderDetailsQuery = `
        INSERT INTO order_details (order_id, product_id, quantity)
        VALUES (?, ?, ?)
      `;
      const orderDetailsParams = [];
      for (let i = 0; i < products.length; i++) {
        orderDetailsParams.push(orderId, products[i].id, products[i].quantity);
      }
      await connection.execute(orderDetailsQuery, orderDetailsParams);
  
      // Update the product quantities in the products table
      const updateQuery = `
        UPDATE products
        SET quantity = quantity - ?
        WHERE id = ?
      `;
      const updateParams = [];
      for (let i = 0; i < products.length; i++) {
        updateParams.push(products[i].quantity, products[i].id);
      }
      await connection.execute(updateQuery, updateParams);
  
      await connection.commit();
  
      // Get the newly created order and return it
    //   order = await Order.getById(orderId);
    } catch (error) {
      await connection.rollback();
      console.log(`Error creating order: ${error.message}`);
      throw error;
    } finally {
      await connection.release();
    }
  
    return order;
  };
  
  module.exports = {createOrder};