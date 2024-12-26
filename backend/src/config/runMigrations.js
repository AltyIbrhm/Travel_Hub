const { poolPromise } = require('./db');
const updateReservationsTable = require('../migrations/02_update_reservations_table');

const runMigrations = async () => {
  try {
    const pool = await poolPromise;
    await updateReservationsTable(pool);
    console.log('All migrations completed successfully');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

runMigrations(); 