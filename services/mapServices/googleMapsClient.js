const { Client } = require('@googlemaps/google-maps-services-js');
const config = require('../../config/apiConfig');

const googleMapsClient = new Client({});

const getDirections = async (origin, destination) => {
    try {
        const response = await googleMapsClient.directions({
            params: {
                origin: origin,
                destination: destination,
                key: config.google.mapsApiKey
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting directions:', error);
        throw error;
    }
};

module.exports = {
    getDirections
}; 