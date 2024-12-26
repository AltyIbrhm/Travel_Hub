const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getConnection } = require('../config/database');

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
router.post('/login', (req, res) => {
  // Login logic will be implemented here
  res.status(501).json({ message: 'Login endpoint not implemented yet' });
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

module.exports = router; 