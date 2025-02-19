const axios = require('axios');

const noaaWeatherService = {
    async getWeatherAlerts() {
        try {
            const response = await axios.get(`https://api.weather.gov/alerts`, {
                headers: {
                    'User-Agent': 'YourAppName' // Replace with your app name
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching NOAA weather alerts:', error);
            throw error;
        }
    }
};

module.exports = noaaWeatherService; 