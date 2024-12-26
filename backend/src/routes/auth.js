const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql, poolPromise } = require('../config/db');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

// Create email transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

/**
 * @swagger
 * /api/auth/test:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Test auth endpoint
 *     description: Tests if the auth endpoint is working
 *     responses:
 *       200:
 *         description: Test successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 dbConnected:
 *                   type: boolean
 *                 userCount:
 *                   type: integer
 */
router.get('/test', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT TOP 1 * FROM users');
    res.json({ 
      message: 'Backend is working!',
      dbConnected: true,
      userCount: result.recordset.length
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Backend error',
      error: err.message,
      dbConnected: false
    });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login user
 *     description: Authenticates a user and returns a token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
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
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     profilePicture:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     address:
 *                       type: string
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  try {
    // Get the connection pool
    const pool = await poolPromise;
    
    const { email, password } = req.body;
    
    // Check if user exists using the pool with correct column names
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM users WHERE email = @email');
    
    const user = result.recordset[0];
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate password - note the column name change from Password to password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token with correct column names
    const payload = {
      user: {
        id: user.id,
        email: user.email
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            profilePicture: user.profile_picture,
            phone: user.phone,
            address: user.address
          }
        });
      }
    );
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register new user
 *     description: Creates a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Email already exists
 *       500:
 *         description: Server error
 */
router.post('/register', async (req, res) => {
  try {
    const pool = await poolPromise;
    const { email, password, firstName, lastName } = req.body;

    console.log('Registration attempt for:', { email, firstName, lastName });

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      console.log('Missing required fields');
      return res.status(400).json({ 
        message: 'All fields are required',
        details: {
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null,
          firstName: !firstName ? 'First name is required' : null,
          lastName: !lastName ? 'Last name is required' : null
        }
      });
    }

    // Check if user exists
    const userCheck = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT email FROM users WHERE email = @email');

    if (userCheck.recordset.length > 0) {
      return res.status(409).json({ 
        message: 'Account already exists',
        details: 'An account with this email address already exists. Please try logging in or use a different email.'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    try {
      const insertQuery = `
        INSERT INTO users (
          email, 
          password, 
          first_name, 
          last_name, 
          created_at
        )
        OUTPUT 
          INSERTED.id,
          INSERTED.email,
          INSERTED.first_name,
          INSERTED.last_name
        VALUES (
          @email,
          @password,
          @firstName,
          @lastName,
          GETDATE()
        );
      `;

      const result = await pool.request()
        .input('email', sql.NVarChar(255), email)
        .input('password', sql.NVarChar(255), hashedPassword)
        .input('firstName', sql.NVarChar(100), firstName)
        .input('lastName', sql.NVarChar(100), lastName)
        .query(insertQuery);

      // Return success with user data
      res.status(201).json({ 
        message: 'User registered successfully',
        user: {
          id: result.recordset[0].id,
          email: result.recordset[0].email,
          firstName: result.recordset[0].first_name,
          lastName: result.recordset[0].last_name
        }
      });
    } catch (dbError) {
      console.error('Database error during user creation:', {
        error: dbError.message,
        stack: dbError.stack,
        code: dbError.code,
        number: dbError.number,
        state: dbError.state
      });
      throw dbError;
    }
  } catch (err) {
    console.error('Registration error details:', {
      error: err.message,
      stack: err.stack,
      code: err.code,
      number: err.number,
      state: err.state
    });

    res.status(500).json({ 
      message: 'Registration failed', 
      error: process.env.NODE_ENV === 'development' 
        ? `${err.message} (Code: ${err.code || err.number})` 
        : 'Internal server error',
      details: 'There was a problem creating your account. Please try again later.'
    });
  }
});

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Request password reset
 *     description: Sends a password reset email to the user
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
 *         description: Reset email sent
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const pool = await poolPromise;
    const { email } = req.body;

    console.log('Attempting password reset for email:', email);

    // Check if user exists
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT id, email, first_name FROM users WHERE email = @email');

    console.log('Database query result:', result.recordset);

    // Always return success to prevent email enumeration
    if (result.recordset.length === 0) {
      console.log('No user found with email:', email);
      return res.json({ 
        message: 'If an account exists with this email, you will receive password reset instructions.' 
      });
    }

    const user = result.recordset[0];
    console.log('User found:', user);

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Reset token generated');

    try {
      // Save reset token and expiry in database
      await pool.request()
        .input('userId', sql.Int, user.id)
        .input('resetToken', sql.NVarChar, resetToken)
        .input('resetTokenExpiry', sql.DateTime, new Date(Date.now() + 3600000)) // 1 hour from now
        .query(`
          UPDATE users 
          SET reset_token = @resetToken,
              reset_token_expiry = @resetTokenExpiry
          WHERE id = @userId
        `);

      console.log('Reset token saved to database');

      // Create reset URL
      const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;

      // Send email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request',
        html: `
          <h1>Password Reset Request</h1>
          <p>Hi ${user.first_name},</p>
          <p>You requested to reset your password. Click the link below to reset it:</p>
          <a href="${resetUrl}">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `
      };

      console.log('Attempting to send email with options:', {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request'
      });

      await transporter.sendMail(mailOptions);
      console.log('Reset email sent successfully');

      res.json({ 
        message: 'If an account exists with this email, you will receive password reset instructions.' 
      });
    } catch (innerErr) {
      console.error('Inner error:', innerErr);
      throw innerErr;
    }
  } catch (err) {
    console.error('Password reset error:', err);
    if (err.code === 'EAUTH') {
      console.error('Email authentication failed. Please check your email credentials.');
    }
    res.status(500).json({ 
      message: 'There was a problem processing your request. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Reset password
 *     description: Resets user's password using reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid token
 *       500:
 *         description: Server error
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const pool = await poolPromise;

    // Get user and verify token hasn't expired in database
    const user = await pool.request()
      .input('userId', sql.Int, decoded.userId)
      .input('token', sql.NVarChar, token)
      .input('now', sql.DateTime, new Date())
      .query(`
        SELECT * FROM users 
        WHERE id = @userId 
          AND reset_token = @token 
          AND reset_token_expiry > @now
      `);

    if (user.recordset.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear reset token
    await pool.request()
      .input('userId', sql.Int, decoded.userId)
      .input('password', sql.NVarChar, hashedPassword)
      .query(`
        UPDATE users 
        SET password = @password,
            reset_token = NULL,
            reset_token_expiry = NULL
        WHERE id = @userId
      `);

    res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ message: 'Failed to reset password' });
  }
});

// Add this route to check email availability
router.get('/check-email/:email', async (req, res) => {
  try {
    const pool = await poolPromise;
    const { email } = req.params;

    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT TOP 1 1 FROM Users WHERE Email = @email');

    res.json({
      available: result.recordset.length === 0,
      message: result.recordset.length === 0 
        ? 'Email is available' 
        : 'Email already registered'
    });
  } catch (err) {
    console.error('Email check error:', err);
    res.status(500).json({ message: 'Error checking email availability' });
  }
});

// Add this endpoint for updating user profile
router.put('/profile/update', auth, async (req, res) => {
  try {
    const pool = await poolPromise;
    const { firstName, lastName, phone, address } = req.body;
    const userId = req.user.id;

    // Update user profile
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .input('firstName', sql.NVarChar(100), firstName)
      .input('lastName', sql.NVarChar(100), lastName)
      .input('phone', sql.NVarChar(20), phone || null)
      .input('address', sql.NVarChar(255), address || null)
      .query(`
        UPDATE users
        SET 
          first_name = @firstName,
          last_name = @lastName,
          phone = @phone,
          address = @address
        OUTPUT 
          INSERTED.id,
          INSERTED.email,
          INSERTED.first_name as firstName,
          INSERTED.last_name as lastName,
          INSERTED.phone,
          INSERTED.address
        WHERE id = @userId;
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = result.recordset[0];
    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
});

// Configure multer for profile picture uploads
const uploadDir = path.join(__dirname, '../../uploads/profile-pictures');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

// Add profile picture upload endpoint
router.put('/profile/upload-photo', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('File uploaded:', req.file);
    console.log('Upload directory:', uploadDir);

    const pool = await poolPromise;
    const userId = req.user.id;
    const profilePicturePath = `/uploads/profile-pictures/${path.basename(req.file.path)}`;

    console.log('Profile picture path:', profilePicturePath);

    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .input('profilePicture', sql.NVarChar(255), profilePicturePath)
      .query(`
        UPDATE users
        SET profile_picture = @profilePicture
        OUTPUT 
          INSERTED.id,
          INSERTED.email,
          INSERTED.first_name as firstName,
          INSERTED.last_name as lastName,
          INSERTED.phone,
          INSERTED.address,
          INSERTED.profile_picture as profilePicture
        WHERE id = @userId;
      `);

    console.log('Database update result:', result.recordset[0]);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add file path to response for verification
    res.json({
      message: 'Profile picture updated successfully',
      user: result.recordset[0],
      filePath: profilePicturePath // Add this for debugging
    });
  } catch (err) {
    console.error('Profile picture upload error:', err);
    res.status(500).json({ message: 'Failed to upload profile picture', error: err.message });
  }
});

// Add profile picture delete endpoint
router.delete('/profile/delete-photo', auth, async (req, res) => {
  try {
    const pool = await poolPromise;
    const userId = req.user.id;

    // Get current profile picture path
    const currentPhoto = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT profile_picture FROM users WHERE id = @userId');

    const currentPhotoPath = currentPhoto.recordset[0]?.profile_picture;

    // If there was a profile picture, try to delete the file first
    if (currentPhotoPath) {
      const filePath = path.join(__dirname, '../../', currentPhotoPath.replace(/^\//, ''));
      console.log('Attempting to delete file:', filePath);
      
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log('File deleted successfully');
        } else {
          console.log('File does not exist:', filePath);
        }
      } catch (err) {
        console.error('Error deleting file:', err);
        // Continue even if file deletion fails
      }
    }

    // Update database to remove profile picture reference
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`
        UPDATE users
        SET profile_picture = NULL
        OUTPUT 
          INSERTED.id,
          INSERTED.email,
          INSERTED.first_name as firstName,
          INSERTED.last_name as lastName,
          INSERTED.phone,
          INSERTED.address,
          INSERTED.profile_picture as profilePicture
        WHERE id = @userId;
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile picture deleted successfully',
      user: result.recordset[0]
    });
  } catch (err) {
    console.error('Profile picture delete error:', err);
    res.status(500).json({ message: 'Failed to delete profile picture', error: err.message });
  }
});

// Test email configuration
router.post('/test-email', async (req, res) => {
  try {
    console.log('Email configuration:', {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD ? '****' : undefined
    });

    // Verify transporter
    await transporter.verify();
    console.log('Email configuration is valid');

    // Send test email
    const testMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: 'Test Email',
      text: 'This is a test email to verify the configuration.'
    };

    await transporter.sendMail(testMailOptions);
    res.json({ message: 'Test email sent successfully' });
  } catch (err) {
    console.error('Email test error:', err);
    res.status(500).json({ 
      message: 'Email configuration error',
      error: err.message,
      code: err.code
    });
  }
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get current user
 *     description: Returns the current authenticated user's information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *       401:
 *         description: Not authorized
 */
router.get('/me', auth, async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('userId', sql.Int, req.user.id)
      .query(`
        SELECT 
          id,
          email,
          first_name as firstName,
          last_name as lastName,
          profile_picture as profilePicture,
          phone,
          address
        FROM users 
        WHERE id = @userId
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;