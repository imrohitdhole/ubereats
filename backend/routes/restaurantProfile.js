const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const Restaurant = require('../models/restaurant');
const router = express.Router();

// Multer Setup
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Middleware to Verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Forbidden: Invalid token' });
    req.restaurantId = decoded.restaurantId;
    next();
  });
};

// GET Restaurant Profile
router.get('/', authenticateToken, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.restaurantId);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    if (restaurant.restaurantImage && !restaurant.restaurantImage.startsWith('http')) {
      restaurant.restaurantImage = `http://localhost:5001${restaurant.restaurantImage}`;
    }

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// UPDATE Restaurant Profile
router.put('/', authenticateToken, upload.single('restaurantImage'), async (req, res) => {
  try {
    const { name, street, city, state, zipcode, mobileNumber, opensAt, closesAt, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const updateData = { name, street, city, state, zipcode, mobileNumber, opensAt, closesAt, description };
    if (image) updateData.restaurantImage = image;

    const restaurant = await Restaurant.findByIdAndUpdate(req.restaurantId, updateData, { new: true });
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    res.json({ message: 'Profile updated successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// DELETE Restaurant Profile
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.restaurantId);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    res.json({ message: 'Profile deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.use('/uploads', express.static('uploads'));

module.exports = router;