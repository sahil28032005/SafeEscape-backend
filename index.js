const noaaWeatherService = require('./services/alertServices/noaaWeatherService');
const usgsEarthquakeService = require('./services/alertServices/usgsEarthquakeService');
const openFemaService = require('./services/alertServices/openFemaService');
const openWeatherService = require('./services/alertServices/openWeatherService');

async function fetchAlerts() {
    try {
        const weatherAlerts = await noaaWeatherService.getWeatherAlerts();
        console.log('NOAA Weather Alerts:', weatherAlerts);

        const recentEarthquakes = await usgsEarthquakeService.getRecentEarthquakes();
        console.log('Recent Earthquakes:', recentEarthquakes);

        const disasterDeclarations = await openFemaService.getDisasterDeclarations();
        console.log('OpenFEMA Disaster Declarations:', disasterDeclarations);

        // Fetch current weather from OpenWeather
        const city = 'London'; // Change this to the desired city
        const currentWeather = await openWeatherService.getCurrentWeather(city);
        console.log('Current Weather in', city, ':', currentWeather);

        // Fetch weather alerts from OpenWeather
        const weatherAlertsOpenWeather = await openWeatherService.getWeatherAlerts(city);
        console.log('OpenWeather Alerts for', city, ':', weatherAlertsOpenWeather);
    } catch (error) {
        console.error('Error fetching alerts:', error);
    }
}

fetchAlerts(); 