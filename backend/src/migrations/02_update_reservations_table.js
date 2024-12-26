const updateReservationsTable = async (pool) => {
  try {
    // Check existing columns
    const result = await pool.request().query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'reservations'
    `);
    
    const existingColumns = result.recordset.map(r => r.COLUMN_NAME.toLowerCase());
    const queries = [];

    // Add missing columns if they don't exist
    if (!existingColumns.includes('pickup_location')) {
      queries.push('ALTER TABLE reservations ADD pickup_location NVARCHAR(255)');
    }
    if (!existingColumns.includes('dropoff_location')) {
      queries.push('ALTER TABLE reservations ADD dropoff_location NVARCHAR(255)');
    }
    if (!existingColumns.includes('pickup_date')) {
      queries.push('ALTER TABLE reservations ADD pickup_date DATETIME');
    }
    if (!existingColumns.includes('vehicle_type')) {
      queries.push('ALTER TABLE reservations ADD vehicle_type NVARCHAR(50)');
    }
    if (!existingColumns.includes('passengers')) {
      queries.push('ALTER TABLE reservations ADD passengers INT');
    }
    if (!existingColumns.includes('luggage')) {
      queries.push('ALTER TABLE reservations ADD luggage INT');
    }
    if (!existingColumns.includes('distance')) {
      queries.push('ALTER TABLE reservations ADD distance DECIMAL(10,2)');
    }
    if (!existingColumns.includes('total_cost')) {
      queries.push('ALTER TABLE reservations ADD total_cost DECIMAL(10,2)');
    }
    if (!existingColumns.includes('status')) {
      queries.push('ALTER TABLE reservations ADD status NVARCHAR(50) DEFAULT \'pending\'');
    }
    if (!existingColumns.includes('created_at')) {
      queries.push('ALTER TABLE reservations ADD created_at DATETIME DEFAULT GETDATE()');
    }
    if (!existingColumns.includes('updated_at')) {
      queries.push('ALTER TABLE reservations ADD updated_at DATETIME DEFAULT GETDATE()');
    }

    // Execute all alter table queries
    for (const query of queries) {
      await pool.request().query(query);
    }

    // Add indexes if they don't exist
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_reservations_user_id')
      CREATE INDEX idx_reservations_user_id ON reservations(user_id);
      
      IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_reservations_status')
      CREATE INDEX idx_reservations_status ON reservations(status);
      
      IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_reservations_pickup_date')
      CREATE INDEX idx_reservations_pickup_date ON reservations(pickup_date);
    `);

    console.log('Reservations table updated successfully');
  } catch (err) {
    console.error('Error updating reservations table:', err);
    throw err;
  }
};

module.exports = updateReservationsTable; 