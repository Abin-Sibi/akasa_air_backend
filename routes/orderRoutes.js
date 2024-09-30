const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Fetch all orders
router.get('/orders', orderController.getAllOrders);

// Update order status
router.put('/orders/:orderId', orderController.updateOrderStatus);

module.exports = router;
