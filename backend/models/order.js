const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  total_price: { type: Number, required: true },
  delivery_address: { type: String, required: true },
  order_status: { 
    type: String, 
    enum: ['Order Received', 'Order Preparing', 'Ready to Deliver', 'Delivered'], 
    default: 'Order Received' 
  },
  items: [{
    dish_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  }],
  created_at: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Order', orderSchema);
