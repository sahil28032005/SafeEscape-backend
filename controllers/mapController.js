const mapService = require('../services/mapServices/googleMapsClient');

exports.getEvacuationRoutes = async (req, res) => {
    try {
        const { origin, destination } = req.query;
        
        if (!origin || !destination) {
            return res.status(400).json({
                success: false,
                error: 'Origin and destination are required'
            });
        }

        const routes = await mapService.getDirections(origin, destination);
        res.status(200).json({
            success: true,
            data: routes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.findSafeLocations = async (req, res) => {
    try {
        const { lat, lng, radius } = req.query;

        // Validate required parameters
        if (!lat || !lng) {
            return res.status(400).json({
                success: false,
                error: 'Latitude and longitude are required'
            });
        }

        // Optional: Validate radius if provided
        const radiusValue = radius ? parseInt(radius) : 5000; // Default to 5000 if not provided

        const locations = await mapService.findNearbySafeLocations(
            { lat: parseFloat(lat), lng: parseFloat(lng) },
            radiusValue
        );

        res.status(200).json({
            success: true,
            data: locations
        });
    } catch (error) {
        console.error('Error finding safe locations:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.getDistanceMatrix = async (req, res) => {
    try {
        const { origins, destinations } = req.query;

        // Validate required parameters
        if (!origins || !destinations) {
            return res.status(400).json({
                success: false,
                error: 'Origins and destinations are required'
            });
        }

        const distanceMatrix = await mapService.getDistanceMatrix(origins.split(','), destinations.split(','));

        res.status(200).json({
            success: true,
            data: distanceMatrix
        });
    } catch (error) {
        console.error('Error getting distance matrix:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.geocodeLocation = async (req, res) => {
    try {
        const { address } = req.query;

        // Validate required parameters
        if (!address) {
            return res.status(400).json({
                success: false,
                error: 'Address is required'
            });
        }

        const location = await mapService.geocodeAddress(address);

        res.status(200).json({
            success: true,
            data: location
        });
    } catch (error) {
        console.error('Error geocoding address:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}; 