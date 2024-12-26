const express = require('express');
const router = express.Router();
const AirportModel = require('../models/airportModel');

/**
 * @swagger
 * /api/airports:
 *   get:
 *     summary: Get all airports
 *     tags: [Airports]
 *     responses:
 *       200:
 *         description: List of all airports
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   code:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 */
router.get('/', async (req, res) => {
  try {
    const airports = await AirportModel.getAllAirports();
    res.json(airports);
  } catch (error) {
    console.error('Error fetching airports:', error);
    res.status(500).json({ error: 'Failed to fetch airports' });
  }
});

module.exports = router; 