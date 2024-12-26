const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getConnection } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     ForgotPasswordRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *     ForgotPasswordResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Response message
 *         resetToken:
 *           type: string
 *           description: Password reset token (only in development)
 *     ResetPasswordRequest:
 *       type: object
 *       required:
 *         - token
 *         - newPassword
 *       properties:
 *         token:
 *           type: string
 *           description: Reset token received via email
 *         newPassword:
 *           type: string
 *           description: New password to set
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login to the application
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 *       400:
 *         description: Invalid request
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    const pool = await getConnection();

    // Find user by email
    const result = await pool.request()
      .input('email', email.toLowerCase())
      .query('SELECT * FROM Users WHERE email = @email');

    if (result.recordset.length === 0) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const user = result.recordset[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-default-secret-key',
      { expiresIn: '24h' }
    );

    // Return user data and token
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid request or email already exists
 */
router.post('/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phoneNumber } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        message: 'Missing required fields',
        details: {
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null,
          firstName: !firstName ? 'First name is required' : null,
          lastName: !lastName ? 'Last name is required' : null
        }
      });
    }

    const pool = await getConnection();

    // Check if user already exists
    const userCheck = await pool.request()
      .input('email', email)
      .query('SELECT email FROM Users WHERE email = @email');

    if (userCheck.recordset.length > 0) {
      return res.status(400).json({
        message: 'Email already registered'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const result = await pool.request()
      .input('email', email)
      .input('password', hashedPassword)
      .input('firstName', firstName)
      .input('lastName', lastName)
      .input('phoneNumber', phoneNumber)
      .query(`
        INSERT INTO Users (email, password, firstName, lastName, phoneNumber, createdAt, updatedAt)
        OUTPUT 
          INSERTED.id,
          INSERTED.email,
          INSERTED.firstName,
          INSERTED.lastName,
          INSERTED.phoneNumber,
          INSERTED.createdAt,
          INSERTED.updatedAt
        VALUES (
          @email,
          @password,
          @firstName,
          @lastName,
          @phoneNumber,
          GETDATE(),
          GETDATE()
        );
      `);

    const newUser = result.recordset[0];

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET || 'your-default-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phoneNumber: newUser.phoneNumber,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      message: 'Error creating user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @swagger
 * /api/auth/check-email:
 *   post:
 *     summary: Check if email is already registered
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Email availability check result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        message: 'Email is required' 
      });
    }

    const pool = await getConnection();
    
    // Check if email exists
    const result = await pool.request()
      .input('email', email.toLowerCase())
      .query('SELECT TOP 1 1 FROM Users WHERE email = @email');

    const exists = result.recordset.length > 0;

    res.json({
      exists,
      message: exists ? 'Email is already registered' : 'Email is available'
    });

  } catch (error) {
    console.error('Email check error:', error);
    res.status(500).json({ 
      message: 'Error checking email availability',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request a password reset link
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset email sent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForgotPasswordResponse'
 *       400:
 *         description: Invalid email or email not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        message: 'Email is required' 
      });
    }

    const pool = await getConnection();

    // Add columns if they don't exist
    try {
      await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Users') AND name = 'resetToken')
        BEGIN
            ALTER TABLE Users
            ADD resetToken NVARCHAR(MAX)
        END

        IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Users') AND name = 'resetTokenExpiry')
        BEGIN
            ALTER TABLE Users
            ADD resetTokenExpiry DATETIME
        END
      `);
    } catch (err) {
      console.error('Error adding columns:', err);
    }
    
    // Check if user exists
    const result = await pool.request()
      .input('email', email.toLowerCase())
      .query('SELECT id, firstName FROM Users WHERE email = @email');

    if (result.recordset.length === 0) {
      return res.status(400).json({
        message: 'No account found with this email address'
      });
    }

    const user = result.recordset[0];

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-default-secret-key',
      { expiresIn: '1h' }
    );

    // Store reset token and expiry in database
    await pool.request()
      .input('userId', user.id)
      .input('resetToken', resetToken)
      .input('resetTokenExpiry', new Date(Date.now() + 3600000)) // 1 hour from now
      .query(`
        UPDATE Users 
        SET resetToken = @resetToken,
            resetTokenExpiry = @resetTokenExpiry,
            updatedAt = GETDATE()
        WHERE id = @userId
      `);

    // TODO: Send reset email
    // For now, we'll just return the token in the response
    // In production, you should send this via email
    res.json({
      message: 'Password reset instructions have been sent to your email',
      resetToken // Remove this in production
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      message: 'Error processing password reset request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset user's password using reset token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid token or password
 *       404:
 *         description: User not found
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        message: 'Token and new password are required'
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-default-secret-key');
    } catch (err) {
      return res.status(400).json({
        message: 'Invalid or expired reset token'
      });
    }

    const pool = await getConnection();

    // Check if user exists and token matches
    const userResult = await pool.request()
      .input('userId', decoded.userId)
      .input('resetToken', token)
      .query('SELECT * FROM Users WHERE id = @userId AND resetToken = @resetToken AND resetTokenExpiry > GETDATE()');

    if (userResult.recordset.length === 0) {
      return res.status(404).json({
        message: 'Invalid or expired reset token'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear reset token
    await pool.request()
      .input('userId', decoded.userId)
      .input('password', hashedPassword)
      .query(`
        UPDATE Users 
        SET password = @password,
            resetToken = NULL,
            resetTokenExpiry = NULL,
            updatedAt = GETDATE()
        WHERE id = @userId
      `);

    res.json({
      message: 'Password has been successfully reset'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      message: 'Error resetting password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 role:
 *                   type: string
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('userId', req.user.id)
      .query('SELECT id, email, firstName, lastName, phoneNumber FROM Users WHERE id = @userId');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ 
      message: 'Error fetching user profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router; 