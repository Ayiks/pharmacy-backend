const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const orderController = require('../controllers/orderController');

// POST /orders
router.post('/orders', orderController.createOrder);

module.exports = router;
