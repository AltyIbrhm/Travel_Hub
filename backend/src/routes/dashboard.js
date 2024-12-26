const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { sql, poolPromise } = require('../config/db');

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *       500:
 *         description: Server error
 */
router.get('/stats', auth, async (req, res) => {
  try {
    const pool = await poolPromise;
    const userId = req.user.id;

    // Get total reservations
    const totalResult = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT COUNT(*) as total FROM reservations WHERE user_id = @userId');

    // Get upcoming reservations
    const upcomingResult = await pool.request()
      .input('userId', sql.Int, userId)
      .input('currentDate', sql.DateTime, new Date())
      .query(`
        SELECT COUNT(*) as upcoming 
        FROM reservations 
        WHERE user_id = @userId 
        AND pickup_date > @currentDate
        AND status = 'pending'
      `);

    // Get completed reservations
    const completedResult = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT COUNT(*) as completed 
        FROM reservations 
        WHERE user_id = @userId 
        AND status = 'completed'
      `);

    res.json({
      totalReservations: totalResult.recordset[0].total || 0,
      upcomingReservations: upcomingResult.recordset[0].upcoming || 0,
      completedReservations: completedResult.recordset[0].completed || 0
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ 
      message: 'Error fetching dashboard statistics',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

/**
 * @swagger
 * /api/dashboard/activity:
 *   get:
 *     summary: Get recent activity
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent activity list
 *       500:
 *         description: Server error
 */
router.get('/activity', auth, async (req, res) => {
  try {
    const pool = await poolPromise;
    const userId = req.user.id;

    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .input('limit', sql.Int, 5)
      .query(`
        SELECT TOP (@limit)
          id,
          pickup_location,
          dropoff_location,
          pickup_date,
          status,
          total_cost,
          created_at
        FROM reservations
        WHERE user_id = @userId
        ORDER BY created_at DESC
      `);

    const activity = result.recordset.map(booking => ({
      id: booking.id,
      time: booking.created_at,
      description: `${booking.status.toUpperCase()}: ${booking.pickup_location} to ${booking.dropoff_location}`,
      amount: booking.total_cost,
      status: booking.status
    }));

    res.json(activity);
  } catch (err) {
    console.error('Error fetching activity:', err);
    res.status(500).json({ 
      message: 'Error fetching activity',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router; 