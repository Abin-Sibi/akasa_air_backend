// models/order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' },
      foodName: String,
      quantity: Number,
      price: Number,
      
    }
  ],
  total: Number,
  status:String,
  paymentMethod:String,
  deliveryAddress:String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
