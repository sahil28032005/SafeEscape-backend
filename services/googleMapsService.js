const { Client } = require('@googlemaps/google-maps-services-js');
const apiKeys = require('../config/apiConfig');

const client = new Client({});

class GoogleMapsService {
  async getDirections(origin, destination) {
    try {
      const response = await client.directions({
        params: {
          origin,
          destination,
          key: apiKeys.GOOGLE_MAPS_API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch directions: ' + error.message);
    }
  }

  async findNearbyPlaces(location, radius, type) {
    try {
      const response = await client.placesNearby({
        params: {
          location,
          radius,
          type,
          key: apiKeys.GOOGLE_MAPS_API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch nearby places: ' + error.message);
    }
  }
}

module.exports = new GoogleMapsService();