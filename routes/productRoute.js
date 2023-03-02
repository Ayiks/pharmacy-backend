const express = require('express');
const ProductController = require('../controllers/productController');
const Product = require('../models/product');

const router = express.Router();

router.get('/products', ProductController.getAllProduct);

router.post('/products', ProductController.createProduct);

router.get('/products/:id', ProductController.getProductById);

router.patch('/products/:id', ProductController.updateProduct);

router.delete('/products/:id', ProductController.deleteProduct);

module.exports = router;