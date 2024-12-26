const express = require('express');
const router = express.Router();
const RouteController = require('../controllers/routeController');

router.get('/', RouteController.getAllRoutes);

module.exports = router; 