const axios = require('axios');
const config = require('../../config/apiConfig');

const openWeatherService = {
    async getCurrentWeather(city) {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
                params: {
                    q: city, // City name
                    appid: config.openWeather.apiKey, // Your API key
                    units: 'metric' // Use 'imperial' for Fahrenheit
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching OpenWeather data:', error.response ? error.response.data : error.message);
            throw error;
        }
    },

    async getWeatherAlerts(city) {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/alerts`, {
                params: {
                    q: city,
                    appid: config.openWeather.apiKey
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching OpenWeather alerts:', error);
            throw error;
        }
    }
};

// Example usage
openWeatherService.getCurrentWeather('London')
    .then(data => console.log(data))
    .catch(err => console.error(err));

module.exports = openWeatherService; 