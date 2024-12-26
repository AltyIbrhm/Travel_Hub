const sql = require('mssql');
require('dotenv').config();
const app = require('./app');  // Import the app configuration

// SQL Server configuration
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    trustServerCertificate: true,
    encrypt: false
  }
};

// Connect to SQL Server
sql.connect(dbConfig)
  .then(() => {
    console.log('Connected to SQL Server');
    console.log('Database:', dbConfig.database);
    console.log('Server:', dbConfig.server);
    
    // Start server after DB connection
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('SQL Server connection error:', err);
    process.exit(1);
  });

// Global error handler
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

// ... rest of your server.js code 
// ... rest of your server.js code 