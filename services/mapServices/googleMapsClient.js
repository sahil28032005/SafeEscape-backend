const { Client } = require('@googlemaps/google-maps-services-js');
const config = require('../../config/apiConfig');

// Add this at the top to verify API key is loaded
console.log('Google Maps API Key available:', !!config.google.mapsApiKey);

// Initialize Google Maps client
const googleMapsClient = new Client({});

const mapService = {
    // Get directions between two points
    async getDirections(origin, destination, mode = 'driving') {
        try {
            // Format coordinates if they're provided as strings
            const formatLocation = (location) => {
                if (typeof location === 'string') {
                    // Check if it's coordinates (contains comma)
                    if (location.includes(',')) {
                        const [lat, lng] = location.split(',').map(Number);
                        return { lat, lng };
                    }
                    // If it's a place name, return as is
                    return location;
                }
                return location;
            };

            const formattedOrigin = formatLocation(origin);
            const formattedDestination = formatLocation(destination);

            console.log('Getting directions:', {
                origin: formattedOrigin,
                destination: formattedDestination,
                mode
            });

            const response = await googleMapsClient.directions({
                params: {
                    origin: formattedOrigin,
                    destination: formattedDestination,
                    mode: mode,
                    alternatives: true,
                    avoid: ['tolls', 'highways'],
                    key: config.google.mapsApiKey,
                    language: 'en',
                    region: 'in' // Add region parameter for India
                }
            });

            if (response.data.status !== 'OK') {
                throw new Error(`Directions API error: ${response.data.status}`);
            }

            return response.data.routes;
        } catch (error) {
            console.error('Error getting directions:', error);
            throw error;
        }
    },

    // Find nearby safe locations
    async findNearbySafeLocations(location, radius = 5000) {
        try {
            const response = await googleMapsClient.placesNearby({
                params: {
                    location: location,
                    radius: radius,
                    type: ['hospital', 'police', 'fire_station'], // Safe location types
                    rankby: 'distance',
                    key: config.google.mapsApiKey
                }
            });

            if (response.data.status !== 'OK') {
                throw new Error(`Places API error: ${response.data.status}`);
            }

            return response.data.results;
        } catch (error) {
            console.error('Error finding safe locations:', error);
            throw error;
        }
    },

    // Get distance matrix for multiple origins/destinations
    async getDistanceMatrix(origins, destinations) {
        try {
            const response = await googleMapsClient.distancematrix({
                params: {
                    origins: origins,
                    destinations: destinations,
                    mode: 'driving',
                    key: config.google.mapsApiKey
                }
            });

            if (response.data.status !== 'OK') {
                throw new Error(`Distance Matrix API error: ${response.data.status}`);
            }

            return response.data;
        } catch (error) {
            console.error('Error getting distance matrix:', error);
            throw error;
        }
    },

    // Geocode an address to coordinates
    async geocodeAddress(address) {
        try {
            const response = await googleMapsClient.geocode({
                params: {
                    address: address,
                    key: config.google.mapsApiKey
                }
            });

            if (response.data.status !== 'OK') {
                throw new Error(`Geocoding API error: ${response.data.status}`);
            }

            return response.data.results[0].geometry.location;
        } catch (error) {
            console.error('Error geocoding address:', error);
            throw error;
        }
    }
};

module.exports = mapService; 