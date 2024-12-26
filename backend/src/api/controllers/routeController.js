const RouteModel = require('../models/routeModel');

class RouteController {
  static async getAllRoutes(req, res) {
    try {
      console.log('Fetching all routes...');
      const routes = await RouteModel.getAllRoutes();
      console.log('Routes fetched:', routes);
      res.json(routes);
    } catch (error) {
      console.error('Route Controller Error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch routes',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
}

module.exports = RouteController; 