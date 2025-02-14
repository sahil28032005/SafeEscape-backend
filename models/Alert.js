const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  type: { type: String, required: true },
  severity: { type: String, enum: ['low', 'medium', 'high'], required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  description: String,
  timestamp: { type: Date, default: Date.now },
  affectedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

module.exports = mongoose.model('Alert', alertSchema); 