const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  emergencyContacts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EmergencyContact'
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema); 