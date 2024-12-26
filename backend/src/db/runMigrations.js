const fs = require('fs').promises;
const path = require('path');
const { sql, poolPromise } = require('../config/db');

async function runMigrations() {
  try {
    const pool = await poolPromise;
    console.log('Connected to database');

    // Read and execute the migration file
    const migrationPath = path.join(__dirname, 'migrations', 'create_tables.sql');
    const migrationSQL = await fs.readFile(migrationPath, 'utf8');

    // Split the file into individual statements
    const statements = migrationSQL.split(';').filter(stmt => stmt.trim());

    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        await pool.request().query(statement);
        console.log('Executed statement:', statement.trim().slice(0, 50) + '...');
      }
    }

    console.log('All migrations completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error running migrations:', err);
    process.exit(1);
  }
}

runMigrations(); 