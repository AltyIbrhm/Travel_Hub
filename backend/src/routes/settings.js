const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../config/db');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/settings/notifications:
 *   get:
 *     tags:
 *       - Settings
 *     summary: Get user notification preferences
 *     description: Retrieves the notification preferences for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification preferences retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/notifications', auth, async (req, res) => {
  try {
    const pool = await poolPromise;
    const userId = req.user.id;

    // Get user preferences
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT 
          email_notifications,
          sms_notifications,
          marketing_notifications,
          app_updates,
          security_alerts
        FROM user_preferences 
        WHERE user_id = @userId
      `);

    // If no preferences exist, return defaults
    if (result.recordset.length === 0) {
      return res.json({
        email: true,
        sms: false,
        marketing: true,
        updates: true,
        security: true
      });
    }

    const prefs = result.recordset[0];
    res.json({
      email: prefs.email_notifications,
      sms: prefs.sms_notifications,
      marketing: prefs.marketing_notifications,
      updates: prefs.app_updates,
      security: prefs.security_alerts
    });
  } catch (err) {
    console.error('Get notification preferences error:', err);
    res.status(500).json({ message: 'Failed to get notification preferences' });
  }
});

/**
 * @swagger
 * /api/settings/notifications:
 *   put:
 *     tags:
 *       - Settings
 *     summary: Update notification preferences
 *     description: Updates the notification preferences for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: boolean
 *               sms:
 *                 type: boolean
 *               marketing:
 *                 type: boolean
 *               updates:
 *                 type: boolean
 *               security:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Preferences updated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put('/notifications', auth, async (req, res) => {
  try {
    const pool = await poolPromise;
    const userId = req.user.id;
    const { email, sms, marketing, updates, security } = req.body;

    // Upsert preferences
    await pool.request()
      .input('userId', sql.Int, userId)
      .input('email', sql.Bit, email)
      .input('sms', sql.Bit, sms)
      .input('marketing', sql.Bit, marketing)
      .input('updates', sql.Bit, updates)
      .input('security', sql.Bit, security)
      .query(`
        MERGE user_preferences AS target
        USING (SELECT @userId as user_id) AS source
        ON target.user_id = source.user_id
        WHEN MATCHED THEN
          UPDATE SET
            email_notifications = @email,
            sms_notifications = @sms,
            marketing_notifications = @marketing,
            app_updates = @updates,
            security_alerts = @security
        WHEN NOT MATCHED THEN
          INSERT (user_id, email_notifications, sms_notifications, marketing_notifications, app_updates, security_alerts)
          VALUES (@userId, @email, @sms, @marketing, @updates, @security);
      `);

    res.json({ 
      message: 'Notification preferences updated successfully',
      preferences: { email, sms, marketing, updates, security }
    });
  } catch (err) {
    console.error('Update notification preferences error:', err);
    res.status(500).json({ message: 'Failed to update notification preferences' });
  }
});

/**
 * @swagger
 * /api/settings/language:
 *   get:
 *     tags:
 *       - Settings
 *     summary: Get user's language settings
 *     description: Retrieves the user's language and timezone preferences
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Language settings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 language:
 *                   type: string
 *                   example: en
 *                 timezone:
 *                   type: string
 *                   example: UTC
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.get('/language', auth, async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('userId', sql.Int, req.user.id)
      .query(`
        SELECT [language], [timezone]
        FROM [user_language_settings]
        WHERE [user_id] = @userId
      `);

    if (result.recordset.length === 0) {
      // If no settings exist, return defaults
      return res.json({ language: 'en', timezone: 'UTC' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching language settings:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/settings/language:
 *   put:
 *     tags:
 *       - Settings
 *     summary: Update user's language settings
 *     description: Updates the user's language and timezone preferences
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - language
 *               - timezone
 *             properties:
 *               language:
 *                 type: string
 *                 example: en
 *               timezone:
 *                 type: string
 *                 example: UTC
 *     responses:
 *       200:
 *         description: Language settings updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 language:
 *                   type: string
 *                   example: en
 *                 timezone:
 *                   type: string
 *                   example: UTC
 *       400:
 *         description: Invalid request - Missing required fields
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.put('/language', auth, async (req, res) => {
  const { language, timezone } = req.body;

  // Validate input
  if (!language || !timezone) {
    return res.status(400).json({ message: 'Language and timezone are required' });
  }

  try {
    const pool = await poolPromise;
    
    // Log the input values for debugging
    console.log('Updating language settings:', {
      userId: req.user.id,
      language,
      timezone
    });

    // Execute everything in a single query
    const result = await pool.request()
      .input('userId', sql.Int, req.user.id)
      .input('language', sql.NVarChar(10), language)
      .input('timezone', sql.NVarChar(50), timezone)
      .query(`
        DECLARE @OutputTable TABLE (
          [language] NVARCHAR(10),
          [timezone] NVARCHAR(50)
        );

        MERGE [dbo].[user_language_settings] AS target
        USING (SELECT @userId AS user_id) AS source
        ON target.[user_id] = source.[user_id]
        WHEN MATCHED THEN
          UPDATE SET
            [language] = @language,
            [timezone] = @timezone
        WHEN NOT MATCHED THEN
          INSERT ([user_id], [language], [timezone])
          VALUES (@userId, @language, @timezone)
        OUTPUT inserted.[language], inserted.[timezone] INTO @OutputTable;

        SELECT * FROM @OutputTable;
      `);

    // Log the result for debugging
    console.log('Language settings updated:', result.recordset[0]);

    res.json({
      message: 'Language settings updated successfully',
      settings: result.recordset[0]
    });
  } catch (err) {
    console.error('Error updating language settings:', {
      error: err.message,
      stack: err.stack,
      userId: req.user.id,
      language,
      timezone
    });
    res.status(500).json({ 
      message: 'Failed to update language settings',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router; 