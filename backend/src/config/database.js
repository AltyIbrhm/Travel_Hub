const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

async function getConnection() {
  try {
    console.log('Attempting database connection...');
    const pool = await new sql.ConnectionPool(config).connect();
    console.log('Database connected successfully');
    return pool;
  } catch (error) {
    console.error('Database Connection Error:', error);
    throw error;
  }
}

module.exports = { getConnection }; 