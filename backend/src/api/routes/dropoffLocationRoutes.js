const express = require('express');
const router = express.Router();
const DropoffLocationModel = require('../models/dropoffLocationModel');
const auth = require('../middleware/auth');  // Updated path

/**
 * @swagger
 * /api/dropoff-locations:
 *   get:
 *     summary: Get all dropoff locations
 *     tags: [Dropoff Locations]
 *     responses:
 *       200:
 *         description: List of all dropoff locations
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
 *                   address:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 */
router.get('/', async (req, res) => {
  try {
    const locations = await DropoffLocationModel.getAllLocations();
    res.json(locations);
  } catch (error) {
    console.error('Error fetching dropoff locations:', error);
    res.status(500).json({ error: 'Failed to fetch dropoff locations' });
  }
});

module.exports = router;