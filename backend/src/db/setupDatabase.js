const sql = require('mssql');
const fs = require('fs').promises;
const path = require('path');
const { getConnection } = require('../config/database');

async function setupDatabase() {
  try {
    console.log('Starting database setup...');
    const pool = await getConnection();

    // Read the schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaContent = await fs.readFile(schemaPath, 'utf8');

    // Split the schema into individual commands
    const commands = schemaContent.split('GO');

    // Execute each command
    for (const command of commands) {
      if (command.trim()) {
        try {
          await pool.request().query(command);
          console.log('Successfully executed command');
        } catch (error) {
          console.error('Error executing command:', error);
          throw error;
        }
      }
    }

    console.log('Database setup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase(); 