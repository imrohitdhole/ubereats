const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const Restaurant = require('../models/restaurant');
const router = express.Router();

// Multer Configuration
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Register New Restaurant
router.post(
  '/signup',
  upload.single('restaurantImage'),
  [
    body('name').notEmpty().withMessage('Restaurant name is required'),
    body('emailId').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const {
      name, emailId, password, description, cuisine, mobileNumber,
      street, apt, city, state, zipcode, opensAt, closesAt,
      pickupOption, deliveryOption, veg, nonVeg, vegan,
    } = req.body;

    const restaurantImage = req.file ? `/uploads/${req.file.filename}` : null;

    try {
      const existingRestaurant = await Restaurant.findOne({ email: emailId });
      if (existingRestaurant) {
        return res.status(400).json({ message: 'Restaurant already exists!' });
      }

      const restaurant = new Restaurant({
        name,
        email: emailId,
        password_hash: password,
        description,
        cuisine,
        mobileNumber,
        street,
        apt,
        city,
        state,
        zipcode,
        opensAt,
        closesAt,
        pickupOption: pickupOption === 'true',
        deliveryOption: deliveryOption === 'true',
        veg: veg === 'true',
        nonVeg: nonVeg === 'true',
        vegan: vegan === 'true',
        restaurantImage,
      });

      await restaurant.save();
      res.status(201).json({ message: 'Restaurant registered successfully!', redirect: '/restaurant-login' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }
);

// Get All Restaurants
router.get('/get-restaurants/:user_id', async (req, res) => {
  try {
    const restaurants = await Restaurant.find().select('name cuisine rating restaurantImage');
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;