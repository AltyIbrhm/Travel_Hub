const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { sql, poolPromise } = require('../config/db');

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Reservation management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         pickup_location:
 *           type: string
 *         dropoff_location:
 *           type: string
 *         pickup_date:
 *           type: string
 *           format: date-time
 *         vehicle_type:
 *           type: string
 *           enum: [sedan, suv, van]
 *         passengers:
 *           type: integer
 *         luggage:
 *           type: integer
 *         total_cost:
 *           type: number
 *         distance:
 *           type: number
 *         status:
 *           type: string
 *           enum: [pending, completed, cancelled]
 */

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pickup_location
 *               - dropoff_location
 *               - pickup_date
 *               - vehicle_type
 *               - passengers
 *             properties:
 *               pickup_location:
 *                 type: string
 *               dropoff_location:
 *                 type: string
 *               pickup_date:
 *                 type: string
 *                 format: date-time
 *               vehicle_type:
 *                 type: string
 *                 enum: [sedan, suv, van]
 *               passengers:
 *                 type: integer
 *               luggage:
 *                 type: integer
 *               total_cost:
 *                 type: number
 *               distance:
 *                 type: number
 *     responses:
 *       200:
 *         description: Reservation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 reservationId:
 *                   type: integer
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', auth, async (req, res) => {
  try {
    const pool = await poolPromise;
    
    // Extract and validate data
    const bookingData = {
      userId: req.user.id,
      pickupLocation: String(req.body.pickup_location).trim(),
      destination: String(req.body.dropoff_location).trim(),
      pickupDate: req.body.pickup_date,
      vehicleType: String(req.body.vehicle_type).trim(),
      passengers: Number(req.body.passengers),
      luggage: Number(req.body.luggage),
      totalCost: Number(req.body.total_cost),
      distance: Number(req.body.distance)
    };

    // Validate required fields
    if (!bookingData.destination) {
      return res.status(400).json({
        message: 'Destination is required'
      });
    }

    // Create request and bind parameters
    const request = pool.request();
    
    request.input('userId', sql.Int, bookingData.userId);
    request.input('pickupLocation', sql.NVarChar(2000), bookingData.pickupLocation);
    request.input('destination', sql.NVarChar(2000), bookingData.destination);
    request.input('pickupDate', sql.DateTime, new Date(bookingData.pickupDate));
    request.input('vehicleType', sql.NVarChar(100), bookingData.vehicleType);
    request.input('passengers', sql.Int, bookingData.passengers);
    request.input('luggage', sql.Int, bookingData.luggage);
    request.input('totalCost', sql.Decimal(9,2), bookingData.totalCost);
    request.input('distance', sql.Decimal(9,2), bookingData.distance);

    const result = await request.query(`
      INSERT INTO reservations (
        user_id,
        pickup_location,
        destination,
        date,
        pickup_date,
        vehicle_type,
        passengers,
        luggage,
        total_cost,
        distance,
        status,
        created_at,
        updated_at
      )
      VALUES (
        @userId,
        @pickupLocation,
        @destination,
        GETDATE(),
        @pickupDate,
        @vehicleType,
        @passengers,
        @luggage,
        @totalCost,
        @distance,
        'pending',
        GETDATE(),
        GETDATE()
      );
      
      SELECT SCOPE_IDENTITY() as id;
    `);

    res.json({ 
      message: 'Reservation created successfully',
      reservationId: result.recordset[0].id
    });

  } catch (err) {
    console.error('Reservation error:', {
      message: err.message,
      userId: req.user?.id
    });

    res.status(500).json({ 
      message: 'Failed to create reservation',
      error: 'An error occurred while processing your request'
    });
  }
});

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Get all reservations for the authenticated user
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 reservations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reservation'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', auth, async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('user_id', sql.Int, req.user.id)
      .query(`
        SELECT 
          id,
          user_id,
          pickup_location,
          destination,
          date,
          pickup_date,
          vehicle_type,
          passengers,
          luggage,
          total_cost,
          distance,
          status,
          created_at,
          updated_at
        FROM reservations 
        WHERE user_id = @user_id 
        ORDER BY created_at DESC
      `);

    const reservations = result.recordset.map(booking => ({
      ...booking,
      dropoff_location: booking.destination,
      created_at: new Date(booking.created_at).toLocaleString(),
      pickup_date: new Date(booking.pickup_date).toLocaleString(),
      date: new Date(booking.date).toLocaleString()
    }));

    res.json({
      success: true,
      reservations
    });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reservations'
    });
  }
});

/**
 * @swagger
 * /api/reservations/{id}/cancel:
 *   post:
 *     summary: Cancel a reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The reservation ID
 *     responses:
 *       200:
 *         description: Reservation cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 reservation:
 *                   $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Reservation not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/:id/cancel', auth, async (req, res) => {
  try {
    const pool = await poolPromise;
    const { id } = req.params;

    const result = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .input('userId', sql.Int, req.user.id)
      .query(`
        UPDATE reservations
        SET 
          status = 'cancelled',
          updated_at = GETDATE()
        OUTPUT 
          INSERTED.id,
          INSERTED.status,
          INSERTED.updated_at
        WHERE id = @id AND user_id = @userId;
      `);

    if (!result.recordset || result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found or unauthorized'
      });
    }

    res.json({
      success: true,
      message: 'Reservation cancelled successfully',
      reservation: result.recordset[0]
    });

  } catch (error) {
    console.error('Cancel error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel reservation'
    });
  }
});

/**
 * @swagger
 * /api/reservations/{id}:
 *   put:
 *     summary: Update a reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The reservation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Reservation not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put('/:id', auth, async (req, res) => {
  try {
    const pool = await poolPromise;
    const { id } = req.params;
    const {
      pickup_location,
      dropoff_location,
      pickup_date,
      vehicle_type,
      passengers,
      luggage,
      total_cost,
      distance
    } = req.body;

    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('userId', sql.Int, req.user.id)
      .input('pickupLocation', sql.NVarChar(2000), pickup_location)
      .input('destination', sql.NVarChar(2000), dropoff_location)
      .input('pickupDate', sql.DateTime, new Date(pickup_date))
      .input('vehicleType', sql.NVarChar(100), vehicle_type)
      .input('passengers', sql.Int, passengers)
      .input('luggage', sql.Int, luggage)
      .input('totalCost', sql.Decimal(9,2), total_cost)
      .input('distance', sql.Decimal(9,2), distance)
      .input('updatedAt', sql.DateTime2, new Date())
      .query(`
        UPDATE reservations
        SET pickup_location = @pickupLocation,
            destination = @destination,
            pickup_date = @pickupDate,
            vehicle_type = @vehicleType,
            passengers = @passengers,
            luggage = @luggage,
            total_cost = @totalCost,
            distance = @distance,
            updated_at = @updatedAt
        WHERE id = @id AND user_id = @userId;
        
        SELECT @@ROWCOUNT as count;
      `);

    if (result.recordset[0].count === 0) {
      return res.status(404).json({
        message: 'Reservation not found or unauthorized'
      });
    }

    res.json({
      message: 'Reservation updated successfully'
    });
  } catch (error) {
    console.error('Error updating reservation:', error);
    res.status(500).json({
      message: 'Failed to update reservation'
    });
  }
});

/**
 * @swagger
 * /api/reservations/{id}:
 *   patch:
 *     summary: Update a reservation's status
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Reservation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, completed, cancelled]
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Server error
 */
router.patch('/:id', auth, async (req, res) => {
  try {
    const pool = await poolPromise;
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status. Status must be one of: pending, completed, cancelled'
      });
    }

    // Update the reservation
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('status', sql.NVarChar, status)
      .input('userId', sql.Int, req.user.id)
      .query(`
        UPDATE [dbo].[Reservations]
        SET [status] = @status,
            [updated_at] = GETDATE()
        OUTPUT INSERTED.*
        WHERE [id] = @id AND [user_id] = @userId;
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: 'Reservation not found or you do not have permission to update it'
      });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ 
      message: 'Failed to update reservation',
      error: err.message
    });
  }
});

module.exports = router;