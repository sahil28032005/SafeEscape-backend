const express = require('express');
const { getEvacuationRoutes, findSafeLocations, getDistanceMatrix, geocodeLocation } = require('../controllers/mapController');

const router = express.Router();

router.get('/directions', getEvacuationRoutes);
router.get('/safe-locations', findSafeLocations);
router.get('/distance-matrix', getDistanceMatrix);
router.get('/geocode', geocodeLocation);

module.exports = router;