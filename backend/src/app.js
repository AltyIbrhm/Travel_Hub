const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const path = require('path');
const fs = require('fs');

// Import routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const airportRoutes = require('./routes/airport');
const dropoffLocationRoutes = require('./routes/dropoffLocation');
const reservationRoutes = require('./routes/reservations');
const userRoutes = require('./routes/user');
const settingsRoutes = require('./routes/settings');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// Basic middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'development' 
    ? ['http://localhost:3000', 'http://127.0.0.1:3000']
    : process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads/profile-pictures');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Register routes with proper CORS handling
const registerRoutes = (prefix, router) => {
  app.options(prefix + '/*', cors());
  app.use(prefix, router);
};

registerRoutes('/api/auth', authRoutes);
registerRoutes('/api/profile', profileRoutes);
registerRoutes('/api/airports', airportRoutes);
registerRoutes('/api/dropoff-locations', dropoffLocationRoutes);
registerRoutes('/api/reservations', reservationRoutes);
registerRoutes('/api/users', userRoutes);
registerRoutes('/api/settings', settingsRoutes);
registerRoutes('/api/dashboard', dashboardRoutes);

// Routes discovery endpoint
app.get('/api/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach(handler => {
        if (handler.route) {
          routes.push({
            path: handler.route.path,
            methods: Object.keys(handler.route.methods)
          });
        }
      });
    }
  });
  res.json(routes);
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    path: req.originalUrl
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app; 