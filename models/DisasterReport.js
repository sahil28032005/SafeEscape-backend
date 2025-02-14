const mongoose = require('mongoose');

const disasterReportSchema = new mongoose.Schema({
  type: { type: String, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  severity: { type: Number, required: true },
  description: String,
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  images: [String],
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DisasterReport', disasterReportSchema); 