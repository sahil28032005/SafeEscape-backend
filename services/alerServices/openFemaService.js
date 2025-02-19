const axios = require('axios');

const openFemaService = {
    async getDisasterDeclarations() {
        try {
            const response = await axios.get(`https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries`);
            return response.data;
        } catch (error) {
            console.error('Error fetching OpenFEMA disaster declarations:', error);
            throw error;
        }
    }
};

module.exports = openFemaService; 