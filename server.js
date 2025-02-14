const express = require('express');
const cors = require('cors');
const routeRoutes = require('./routes/routeRoutes');
const safeZoneRoutes = require('./routes/safeZoneRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/routes', routeRoutes);
app.use('/api/safezones', safeZoneRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 