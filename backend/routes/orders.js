const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Order = require('../models/order');
const { sendOrderEvent } = require('../kafka/producer');

// Middleware to authenticate restaurant
const authenticateRestaurantToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Forbidden: Invalid token' });
    req.restaurantId = decoded.restaurantId;
    next();
  });
};

// Middleware to authenticate user
const authenticateUserToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Forbidden: Invalid token' });
    req.userId = decoded.userId;
    next();
  });
};

// Place Order API (User)
router.post('/', authenticateUserToken, async (req, res) => {
  try {
    let { user_id, restaurant_id, items, total_price, delivery_address } = req.body;
    if (user_id !== req.userId) return res.status(403).json({ message:'Forbidden: User ID mismatch' });
    if (typeof items === 'string') {
      items = JSON.parse(items);
    }
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: '`items` should be a valid array.' });
    }
    const order = new Order({
      restaurant_id,
      user_id,
      total_price,
      delivery_address,
      items,
    });
    const savedOrder = await order.save();
    await sendOrderEvent({
      order_id: savedOrder._id,
      restaurant_id,
      user_id,
      total_price,
      delivery_address,
      order_status: 'Order Received',
    });
    res.status(201).json({ message: 'Order placed successfully!', order_id: savedOrder._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Fetch Orders for Restaurant (Restaurant)
router.get('/restaurant/:restaurantId', authenticateRestaurantToken, async (req, res) => {
  try {
    const { restaurantId } = req.params;
    if (restaurantId !== req.restaurantId) {
      return res.status(403).json({ message: 'Forbidden: You can only access orders for your restaurant' });
    }
    const orders = await Order.find({ restaurant_id: restaurantId })
      .populate('items.dish_id', 'name image')
      .sort({ created_at: -1 });
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Fetch Orders for User (User)
router.get('/user/:userId', authenticateUserToken, async (req, res) => {
  try {
    if (req.params.userId !== req.userId) return res.status(403).json({ message: 'Forbidden: User ID mismatch' });
    const orders = await Order.find({ user_id: req.params.userId })
      .populate('restaurant_id', 'name')
      .populate('items.dish_id', 'name image')
      .sort({ created_at: -1 });
    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for this user.' });
    }
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update Order Status (Restaurant)
router.put('/:id', authenticateRestaurantToken, async (req, res) => {
  const { status } = req.body;
  if (!status || !['Order Received', 'Order Preparing', 'Ready to Deliver', 'Delivered'].includes(status)) {
    return res.status(400).json({ error: 'Valid status is required' });
  }
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    // Check if the authenticated restaurant matches the order's restaurant_id
    if (order.restaurant_id.toString() !== req.restaurantId) {
      return res.status(403).json({ message: 'Forbidden: You can only update orders for your restaurant' });
    }
    order.order_status = status;
    await order.save();
    await sendOrderEvent({
      order_id: order._id,
      restaurant_id: order.restaurant_id,
      user_id: order.user_id,
      total_price: order.total_price,
      delivery_address: order.delivery_address,
      order_status: status,
    });
    res.status(200).json({ message: 'Order status updated successfully!', order });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

module.exports = router;