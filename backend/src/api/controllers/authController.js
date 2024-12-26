const AuthModel = require('../models/authModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { createTransporter } = require('../../config/email');
const emailConfig = require('../../config/emailConfig');
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

class AuthController {
  static async register(req, res) {
    try {
      const { firstName, lastName, email, password } = req.body;

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const pool = await sql.connect();
      const result = await pool.request()
        .input('first_name', sql.VarChar, firstName)
        .input('last_name', sql.VarChar, lastName)
        .input('email', sql.VarChar, email)
        .input('password', sql.VarChar, hashedPassword)
        .query(`
          INSERT INTO users (first_name, last_name, email, password)
          OUTPUT INSERTED.*
          VALUES (@first_name, @last_name, @email, @password)
        `);

      const user = result.recordset[0];

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name
        },
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const user = await UserModel.getUserByEmail(email);

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your-default-secret',
        { expiresIn: '1d' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          profilePicture: user.profile_picture,
          phone: user.phone
        }
      });

    } catch (error) {
      res.status(500).json({ message: 'Server error during login' });
    }
  }

  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(20).toString('hex');
      
      // Save token to database
      const user = await AuthModel.createPasswordResetToken(email, resetToken);
      
      if (!user) {
        // For security, don't reveal if email exists or not
        return res.status(200).json({ 
          message: 'If an account exists with this email, you will receive password reset instructions.' 
        });
      }

      // Create reset URL
      const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

      // Log the reset URL for testing (remove in production)
      console.log('Password Reset URL:', resetUrl);

      // Send immediate response
      res.status(200).json({ 
        message: 'If an account exists with this email, you will receive password reset instructions.',
        // For development only - remove in production
        resetUrl: resetUrl
      });

      // Send email in background
      try {
        const { transporter } = await createTransporter();
        await transporter.sendMail({
          from: emailConfig.from,
          to: email,
          subject: 'Password Reset Request',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1976d2;">Password Reset Request</h2>
              <p>You requested a password reset. Click the link below to reset your password:</p>
              <a href="${resetUrl}">Reset Password</a>
              <p>If you didn't request this, please ignore this email.</p>
              <p>This link will expire in 1 hour.</p>
            </div>
          `
        });
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        // Don't wait for email to send before responding to user
      }

    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ error: 'Failed to process password reset request' });
    }
  }

  static async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({ error: 'Token and new password are required' });
      }

      const user = await AuthModel.resetPassword(token, newPassword);

      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }

      res.json({ message: 'Password reset successful' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ error: 'Failed to reset password' });
    }
  }

  static async verifyResetToken(req, res) {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ error: 'Token is required' });
      }

      const isValid = await AuthModel.verifyResetToken(token);
      
      if (!isValid) {
        return res.status(400).json({ error: 'Invalid or expired token' });
      }

      res.json({ valid: true });
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(500).json({ error: 'Failed to verify token' });
    }
  }
}

module.exports = AuthController; 