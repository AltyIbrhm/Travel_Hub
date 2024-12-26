const AirportModel = require('../models/airportModel');

class AirportController {
  static async getAllAirports(req, res) {
    try {
      const airports = await AirportModel.getAllAirports();
      res.json(airports);
    } catch (error) {
      console.error('Airport Controller Error:', error);
      res.status(500).json({ error: 'Failed to fetch airports' });
    }
  }

  static async getAirportById(req, res) {
    try {
      const airport = await AirportModel.getAirportById(req.params.id);
      if (!airport) {
        return res.status(404).json({ error: 'Airport not found' });
      }
      res.json(airport);
    } catch (error) {
      console.error('Airport Controller Error:', error);
      res.status(500).json({ error: 'Failed to fetch airport' });
    }
  }
}

module.exports = AirportController; 