const express = require('express');
const { getEvacuationRoutes, findSafeLocations, getDistanceMatrix, geocodeLocation } = require('../controllers/mapController');

const router = express.Router();

router.get('/directions', getEvacuationRoutes);//added in frontendF
router.get('/safe-locations', findSafeLocations); //not working
router.get('/distance-matrix', getDistanceMatrix); //working but responec content not found ""ill return distance calculation or time required to react destination
router.get('/geocode', geocodeLocation);

module.exports = router;