const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const emergencyRoutes = require('./routes/emergencyRoutes');
const mapRoutes = require('./routes/mapRoutes');
const alertRoutes = require('./routes/alertRoutes');

// Register Routes
app.use('/api/emergency', emergencyRoutes);
app.use('/api/maps', mapRoutes);
app.use('/api/alerts', alertRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Emergency routes available at http://localhost:${PORT}/api/emergency`);
});
app.get('/ready', (req, res) => {
  res.json({ message: 'Hello World' });
});
