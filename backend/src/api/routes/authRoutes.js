const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql, poolPromise } = require('../../config/db');

// Test endpoint
router.get('/test', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT TOP 1 * FROM Users');
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

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const pool = await poolPromise;
    const { email, password } = req.body;
    
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM Users WHERE Email = @email');
    
    const user = result.recordset[0];
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.Id,
        email: user.Email
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
            id: user.Id,
            email: user.Email,
            firstName: user.FirstName,
            lastName: user.LastName
          }
        });
      }
    );
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 