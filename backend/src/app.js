const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./features/profile/routes/profileRoutes');
const adminRoutes = require('./routes/admin');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const profilesDir = path.join(uploadsDir, 'profiles');

try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  if (!fs.existsSync(profilesDir)) {
    fs.mkdirSync(profilesDir, { recursive: true });
  }
} catch (err) {
  console.error('Error creating upload directories:', err);
}

// Serve static files from the uploads directory
app.use('/api/uploads', express.static(uploadsDir));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);

// Basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  // Log error to error reporting service in production
  process.env.NODE_ENV === 'development' && console.error(err);
  
  res.status(500).json({ 
    status: 'error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

module.exports = app; 