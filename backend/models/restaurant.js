const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  description: { type: String },
  cuisine: { type: String },
  mobileNumber: { type: String },
  street: { type: String },
  apt: { type: String },
  city: { type: String },
  state: { type: String },
  zipcode: { type: String },
  opensAt: { type: String },
  closesAt: { type: String },
  pickupOption: { type: Boolean, default: false },
  deliveryOption: { type: Boolean, default: false },
  veg: { type: Boolean, default: false },
  nonVeg: { type: Boolean, default: false },
  vegan: { type: Boolean, default: false },
  restaurantImage: { type: String },
});

restaurantSchema.pre('save', async function (next) {
  if (this.isModified('password_hash')) {
    this.password_hash = await bcrypt.hash(this.password_hash, 10);
  }
  next();
});

module.exports = mongoose.model('Restaurant', restaurantSchema);