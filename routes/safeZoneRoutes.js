const express = require('express');
const router = express.Router();
const safeZoneController = require('../controllers/safeZoneController');

router.post('/nearest', safeZoneController.getNearestSafeZones);

module.exports = router;