const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');


// Route to add items to the cart
router.post('/add-to-cart', cartController.addToCart);

// Route to get the cart for a particular user
router.get('/:userId', cartController.getCart);

// Route to checkout the cart
router.post('/checkout', cartController.checkoutCart);
router.get('/order-history/:userId', cartController.getOrderHistory);
router.put('/update-quantity', cartController.updateCartQuantity);
router.delete('/remove', cartController.removeFromCart);

module.exports = router;
