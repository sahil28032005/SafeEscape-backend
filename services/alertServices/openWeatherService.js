const axios = require('axios');
require('dotenv').config();

// Use environment variable directly for API key
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

const openWeatherService = {
    async getCurrentWeather(city) {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
                params: {
                    q: city, // City name
                    appid: OPENWEATHER_API_KEY,
                    units: 'metric' // Use 'imperial' for Fahrenheit
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching OpenWeather data:', error.response?.data || error.message);
            // Return default data structure to prevent errors
            return {
                main: { temp: 25, humidity: 50 },
                wind: { speed: 10 },
                weather: [{ main: 'Clear', description: 'clear sky' }]
            };
        }
    },

    async getWeatherAlerts(city) {
        try {
            // First get coordinates for the city
            const cityData = await this.getCurrentWeather(city);
            const lat = cityData.coord.lat;
            const lon = cityData.coord.lon;
            
            // Then use OneCall API which includes alerts
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/onecall`, {
                params: {
                    lat: lat,
                    lon: lon,
                    appid: OPENWEATHER_API_KEY,
                    units: 'metric',
                    exclude: 'minutely,hourly' // Exclude unnecessary data
                }
            });
            
            // Extract alerts or return empty array if none
            return response.data.alerts || [];
        } catch (error) {
            console.error('Error fetching OpenWeather alerts:', error.response?.data || error.message);
            return []; // Return empty array to prevent errors
        }
    },
    
    async hasSevereWeather(city) {
        try {
            const weather = await this.getCurrentWeather(city);
            
            // Check for severe weather conditions
            const severeConditions = [
                'thunderstorm', 'tornado', 'hurricane', 'cyclone',
                'flood', 'heavy rain', 'heavy snow', 'blizzard'
            ];
            
            // Check if any severe condition is in the description
            const description = weather.weather[0].description.toLowerCase();
            const isSevere = severeConditions.some(condition => 
                description.includes(condition)
            );
            
            // Also check for extreme temperatures
            const isExtremeTemp = 
                weather.main.temp > 40 || // Very hot (over 40°C)
                weather.main.temp < -15;  // Very cold (below -15°C)
            
            // Check for high winds
            const isHighWind = weather.wind && weather.wind.speed > 20; // Over 20 m/s
            
            return isSevere || isExtremeTemp || isHighWind;
        } catch (error) {
            console.error('Error checking for severe weather:', error.message);
            return false; // Default to false if there's an error
        }
    }
};

module.exports = openWeatherService;