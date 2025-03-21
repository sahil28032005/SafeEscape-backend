const express = require('express');
const router = express.Router();
const noaaWeatherService = require('../services/alertServices/noaaWeatherService');
const usgsEarthquakeService = require('../services/alertServices/usgsEarthquakeService');
const openFemaService = require('../services/alertServices/openFemaService');
const openWeatherService = require('../services/alertServices/openWeatherService');
// NOAA Weather Alerts endpoint
router.get('/weather/noaa', async (req, res) => {
    try {
        const weatherAlerts = await noaaWeatherService.getWeatherAlerts();
        res.json(weatherAlerts);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching NOAA weather alerts' });
    }
});

// USGS Earthquakes endpoint
router.get('/earthquakes', async (req, res) => {
    try {
        const recentEarthquakes = await usgsEarthquakeService.getRecentEarthquakes();
        res.json(recentEarthquakes);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching earthquake data' });
    }
});

// OpenFEMA Disaster Declarations endpoint
router.get('/disasters', async (req, res) => {
    try {
        const disasterDeclarations = await openFemaService.getDisasterDeclarations();
        res.json(disasterDeclarations);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching disaster declarations' });
    }
});

// OpenWeather Current Weather endpoint
router.get('/weather/current/:city', async (req, res) => {
    try {
        const city = req.params.city;
        const currentWeather = await openWeatherService.getCurrentWeather(city);
        res.json(currentWeather);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching current weather' });
    }
});

// OpenWeather Alerts endpoint
router.get('/weather/openweather/:city', async (req, res) => {
    try {
        const city = req.params.city;
        const weatherAlerts = await openWeatherService.getWeatherAlerts(city);
        res.json(weatherAlerts);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching OpenWeather alerts' });
    }
});

// Add this to your existing alertRoutes.js file

// Weather endpoint
router.get('/weather/:city', async (req, res) => {
  try {
    const { city } = req.params;
    
    if (!city) {
      return res.status(400).json({
        success: false,
        error: 'City parameter is required'
      });
    }
    
    const weatherData = await openWeatherService.getCurrentWeather(city);
    
    res.status(200).json({
      success: true,
      data: weatherData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
module.exports = router;