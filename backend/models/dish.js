const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  main_ingredient: { type: String },
  price: { type: Number, required: true },
  category: { type: String },
  description: { type: String },
  image: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
});

module.exports = mongoose.model('Dish', dishSchema);