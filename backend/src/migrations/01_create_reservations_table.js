const createReservationsTable = async (pool) => {
  try {
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='reservations' and xtype='U')
      BEGIN
        CREATE TABLE reservations (
          id INT IDENTITY(1,1) PRIMARY KEY,
          user_id INT NOT NULL,
          pickup_location NVARCHAR(255) NOT NULL,
          dropoff_location NVARCHAR(255) NOT NULL,
          pickup_date DATETIME NOT NULL,
          vehicle_type NVARCHAR(50) NOT NULL,
          passengers INT NOT NULL,
          luggage INT NOT NULL,
          distance DECIMAL(10,2) NOT NULL,
          total_cost DECIMAL(10,2) NOT NULL,
          status NVARCHAR(50) DEFAULT 'pending',
          created_at DATETIME DEFAULT GETDATE(),
          updated_at DATETIME DEFAULT GETDATE(),
          FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE INDEX idx_reservations_user_id ON reservations(user_id);
        CREATE INDEX idx_reservations_status ON reservations(status);
        CREATE INDEX idx_reservations_pickup_date ON reservations(pickup_date);
      END
    `);
    console.log('Reservations table created successfully');
  } catch (err) {
    console.error('Error creating reservations table:', err);
    throw err;
  }
};

module.exports = createReservationsTable; 