const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../config/db');

/**
 * @swagger
 * /api/profile:
 *   get:
 *     tags:
 *       - Profile
 *     summary: Get user profile
 *     description: Retrieves the profile of the logged-in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  try {
    res.json({ message: 'Profile route working' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @swagger
 * /api/profile/update:
 *   put:
 *     tags:
 *       - Profile
 *     summary: Update user profile
 *     description: Updates the profile of the logged-in user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.put('/update', async (req, res) => {
  try {
    res.json({ message: 'Profile update route working' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 