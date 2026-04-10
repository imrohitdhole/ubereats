const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const Dish = require('../models/dish');
const router = express.Router();

const secretKey = process.env.JWT_SECRET;
const uploadDir = path.join(__dirname, '../uploads/');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Forbidden: Invalid token' });
    req.restaurantId = decoded.restaurantId;
    next();
  });
};

// GET Dishes by Restaurant ID
router.get('/:restaurantId', authenticateToken, async (req, res) => {
  try {
    const { restaurantId } = req.params;
    // Ensure the authenticated restaurant matches the requested restaurantId
    if (restaurantId !== req.restaurantId) {
      return res.status(403).json({ message: 'Forbidden: You can only access dishes for your restaurant' });
    }
    const dishes = await Dish.find({ restaurant_id: restaurantId }).sort({ created_at: -1 });
    res.status(200).json(dishes);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

router.post('/add', authenticateToken, upload.single('image'), async (req, res) => {
  let { name, main_ingredient, price, category, description } = req.body;
  try {
    const restaurant_id = req.restaurantId;
    const imageUrl = req.file ? `http://localhost:5001/uploads/${req.file.filename}` : null;
    const dish = new Dish({
      restaurant_id,
      name,
      main_ingredient,
      price: parseFloat(price),
      category,
      description,
      image: imageUrl,
    });
    await dish.save();
    res.status(201).json({ message: 'Dish added successfully!', dishId: dish._id });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authenticateToken, upload.single('image'), async (req, res) => {
  const dishId = req.params.id;
  let { name, main_ingredient, price, category, description } = req.body;
  try {
    const restaurant_id = req.restaurantId;
    const dish = await Dish.findOne({ _id: dishId, restaurant_id });
    if (!dish) return res.status(404).json({ error: 'Dish not found or access denied' });
    let imageUrl = dish.image;
    if (req.file) {
      imageUrl = `http://localhost:5001/uploads/${req.file.filename}`;
      if (dish.image) {
        const filename = dish.image.split('/').pop();
        const imagePath = path.join(uploadDir, filename);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      }
    }
    dish.name = name;
    dish.main_ingredient = main_ingredient;
    dish.price = parseFloat(price);
    dish.category = category;
    dish.description = description;
    dish.image = imageUrl;
    dish.updated_at = Date.now();
    await dish.save();
    res.status(200).json({ message: 'Dish updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const dishId = req.params.id;
  try {
    const restaurant_id = req.restaurantId;
    const dish = await Dish.findOne({ _id: dishId, restaurant_id });
    if (!dish) return res.status(404).json({ error: 'Dish not found or access denied' });
    if (dish.image) {
      const filename = dish.image.split('/').pop();
      const imagePath = path.join(uploadDir, filename);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }
    await dish.deleteOne();
    res.status(200).json({ message: 'Dish deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;