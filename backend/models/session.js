const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  token: { type: String, required: true },
  expires_at: { type: Date, required: true },
});

module.exports = mongoose.model('Session', sessionSchema);