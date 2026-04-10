const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./models/database');
const { consumeOrderEvents } = require('./kafka/consumer');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const restaurantAuthRoutes = require('./routes/restaurantAuthRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const dishesRoutes = require('./routes/dishes');
const restaurantProfileRoutes = require('./routes/restaurantProfile');
const ordersRoutes = require('./routes/orders');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Start Kafka consumer
consumeOrderEvents().catch(console.error);

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Serve Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Load Routes
app.use('/auth', authRoutes);
app.use('/restaurant/auth', restaurantAuthRoutes);
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/dishes', dishesRoutes);
app.use('/api/restaurant-profile', restaurantProfileRoutes);
app.use('/api/orders', ordersRoutes);

// Google Maps API Key Route
app.get('/api/google-maps-key', (req, res) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Google Maps API Key not found' });
  res.json({ apiKey });
});

// Fetch Restaurant Details & Menu Items
app.get('/api/restaurants/:id', async (req, res) => {
  try {
    const Restaurant = require('./models/restaurant');
    const Dish = require('./models/dish');
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    const menu = await Dish.find({ restaurant_id: req.params.id });
    res.json({ restaurant, menu });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Default Route
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Start the Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));