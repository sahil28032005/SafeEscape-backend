const axios = require('axios');

const usgsEarthquakeService = {
    async getRecentEarthquakes() {
        try {
            const response = await axios.get(`https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson`);
            return response.data.features;
        } catch (error) {
            console.error('Error fetching USGS earthquake data:', error);
            throw error;
        }
    }
};

module.exports = usgsEarthquakeService; 