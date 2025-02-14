const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');

router.post('/evacuation', routeController.getEvacuationRoute);

module.exports = router;