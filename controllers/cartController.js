const User = require('../models/userModel');
const FoodItem = require('../models/foodItemModel');
const Order = require('../models/orderModel');

// Add to Cart
exports.addToCart = async (req, res) => {
  const { userId, productId, quantity} = req.body;

  try {
    // Find the product in the product collection
    const product = await FoodItem.findById(productId);

    if (!product || product.stock < quantity) {
        console.log('eeeeeeeeee')
      return res.status(300).json({ message: 'Product is out of stock or invalid.' });
    }

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the product is already in the cart
    const cartItem = user.cart.find(item => item.productId.equals(productId));

    if (cartItem) {
      // If product exists in the cart, update the quantity
      cartItem.quantity += quantity;
    } else {
      // If product is not in the cart, add it
      user.cart.push({
        productId: product._id,
        foodName: product.foodName,
        price: product.price, // Store price at the time of adding to cart
        quantity: quantity,
        image:product.imageUrl
      });
    }

    await user.save();
    res.json({ cart: user.cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch Cart
exports.getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const cartWithUpdatedStock = await Promise.all(user.cart.map(async (cartItem) => {
      const product = await FoodItem.findById(cartItem.productId);

      return {
        productId: cartItem.productId,
        foodName: cartItem.foodName,
        quantity: cartItem.quantity,
        price: cartItem.price,
        image:cartItem.image,
        currentStock: product.stock, // Fetch the latest stock
        updatedPrice: product.price   // Optionally show latest price
      };
    }));

    res.json({ cart: cartWithUpdatedStock });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Checkout Cart
exports.checkoutCart = async (req, res) => {
    const { userId, paymentMethod,selectedAddress } = req.body;
  
    try {
      // Find the user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      let total = 0;
      const orderItems = [];
      const outOfStockItems = [];
  
      // Process each cart item
      const updatedCart = await Promise.all(user.cart.map(async (cartItem) => {
        const product = await FoodItem.findById(cartItem.productId);
  
        if (!product) {
          return res.status(404).json({ message: `Product not found for ID ${cartItem.productId}` });
        }
  
        // Check stock availability
        if (product.stock < cartItem.quantity) {
          outOfStockItems.push(product.productName); // Collect out-of-stock product names
          return null; // Continue to the next item
        }
  
        // Calculate total cost
        total += product.price * cartItem.quantity;
  
        // Update cart item with the latest price
        cartItem.price = product.price;
  
        orderItems.push({
          productId: product._id,
          productName: product.productName,
          quantity: cartItem.quantity,
          price: product.price
        });
  
        // Deduct stock from product
        product.stock -= cartItem.quantity;
        await product.save();
  
        return cartItem;
      }));
  
      // Check if there are any out-of-stock products
      if (outOfStockItems.length > 0) {
        return res.status(400).json({
          message: 'Some products are out of stock',
          outOfStockItems
        });
      }
  
      // Create the new order
      const newOrder = new Order({
        userId: user._id,
        items: orderItems,
        total: total,
        status:"pending",
        paymentMethod: paymentMethod,
        deliveryAddress:selectedAddress, // Add payment method to the order
      });
  
      await newOrder.save();
  
      // Update user's order history
      user.orders.push({
        orderId: newOrder._id,
        total: total,
        items: orderItems
      });
  
      // Clear the user's cart after successful checkout
      user.cart = [];
      await user.save();
  
      // Send the successful response
      res.json({
        message: 'Checkout successful',
        total,
        cart: updatedCart.filter(item => item !== null), // Remove null entries from updatedCart
        order: newOrder
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

  exports.getOrderHistory = async (req, res) => {
    const { userId } = req.params;
    console.log(userId,'lllllllllll')
  
    try {
      const orders = await Order.find({ userId })
        .populate('items.productId', 'foodName price')
        .sort({ createdAt: -1 }); // Sort by most recent
  
      if (!orders.length) {
        return res.status(404).json({ message: 'No orders found for this user.' });
      }
  
      console.log(orders[0].items)
      res.json({ orders });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };

//   exports.getOrderHistory = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const user = await User.findById(userId).populate('orders.orderId'); // Populate orders

//     if (!user) {
//       return res.status(404).json({ message: 'User not found.' });
//     }

//     res.json({ orders: user.orders });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
  

// Remove from Cart
exports.removeFromCart = async (req, res) => {
    const { userId, productId } = req.body;
  
    try {
      // Find the user
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Filter out the product from the user's cart
      user.cart = user.cart.filter(item => !item.productId.equals(productId));
  
      await user.save();
  
      res.json({ message: 'Item removed from cart', cart: user.cart });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };

  
  // Update Cart Item Quantity
exports.updateCartQuantity = async (req, res) => {
    const { userId, productId, quantityChange } = req.body; // quantityChange can be +1 or -1
  
    try {
      // Find the user
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Find the cart item
      const cartItem = user.cart.find(item => item.productId.equals(productId));
  
      if (!cartItem) {
        return res.status(404).json({ message: 'Product not found in cart.' });
      }
  
      // Update the quantity
      cartItem.quantity += quantityChange;
  
      // If quantity is 0 or less, remove the item from the cart
      if (cartItem.quantity <= 0) {
        user.cart = user.cart.filter(item => !item.productId.equals(productId));
      }
  
      await user.save();
  
      res.json({ message: 'Cart updated', cart: user.cart });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  