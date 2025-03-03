const axios = require('axios');

const noaaWeatherService = {
    async getWeatherAlerts() {
        try {
            const response = await axios.get(`https://api.weather.gov/alerts`, {
                headers: {
                    'User-Agent': 'SafeEscape-App/1.0'
                }
            });
            
            // Transform the response to include important alert details
            const alerts = response.data.features.map(alert => ({
                id: alert.id,
                event: alert.properties.event,
                headline: alert.properties.headline,
                description: alert.properties.description,
                severity: alert.properties.severity,
                area: alert.properties.areaDesc,
                effective: alert.properties.effective,
                expires: alert.properties.expires
            }));
            
            return alerts;
        } catch (error) {
            console.error('Error fetching NOAA weather alerts:', error);
            throw error;
        }
    }
};

module.exports = noaaWeatherService;