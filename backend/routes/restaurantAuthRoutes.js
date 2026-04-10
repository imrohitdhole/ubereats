const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Restaurant = require('../models/restaurant');
const Session = require('../models/session');
const router = express.Router();

// RESTAURANT LOGIN
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const restaurant = await Restaurant.findOne({ email });
      if (!restaurant) {
        return res.status(400).json({ message: 'Restaurant not found! Please sign up first.' });
      }

      const isMatch = await bcrypt.compare(password, restaurant.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password. Please try again.' });
      }

      const token = jwt.sign({ restaurantId: restaurant._id, email: restaurant.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Store session in MongoDB
      await Session.create({
        restaurant_id: restaurant._id,
        token,
        expires_at: new Date(Date.now() + 3600000), // 1 hour
      });

      res.status(200).json({
        message: 'Login successful!',
        token,
        restaurant: {
          id: restaurant._id,
          name: restaurant.name,
          email: restaurant.email,
          location: restaurant.location,
          contactInfo: restaurant.mobileNumber,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }
);

module.exports = router;