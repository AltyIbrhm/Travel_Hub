const express = require('express');
const router = express.Router();
const ReservationModel = require('../models/reservationModel');
const auth = require('../middleware/auth');

// Add auth middleware to protect these routes
router.use(auth);

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Get reservations by user ID
 *     tags: [Reservations]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of user's reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   user_id:
 *                     type: integer
 *                   airport_id:
 *                     type: integer
 *                   dropoff_location_id:
 *                     type: integer
 *                   pickup_date:
 *                     type: string
 *                     format: date-time
 *                   flight_number:
 *                     type: string
 *                   status:
 *                     type: string
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               airport_id:
 *                 type: integer
 *               dropoff_location_id:
 *                 type: integer
 *               pickup_date:
 *                 type: string
 *                 format: date-time
 *               flight_number:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reservation created successfully
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId;
    const reservations = await ReservationModel.getReservationsByUserId(userId);
    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

router.post('/', async (req, res) => {
  try {
    const reservation = await ReservationModel.createReservation(req.body);
    res.status(201).json(reservation);
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ error: 'Failed to create reservation' });
  }
});

module.exports = router; 