const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../config/db');

router.get('/', async (req, res) => {
  try {
    res.json({ message: 'Airports route working' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 