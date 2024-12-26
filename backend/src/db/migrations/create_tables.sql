-- Create airports table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='airports' and xtype='U')
CREATE TABLE airports (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    code NVARCHAR(10) NOT NULL UNIQUE,
    city NVARCHAR(100),
    country NVARCHAR(100),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Create dropoff_locations table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='dropoff_locations' and xtype='U')
CREATE TABLE dropoff_locations (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    address NVARCHAR(MAX),
    city NVARCHAR(100),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Create reservations table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='reservations' and xtype='U')
CREATE TABLE reservations (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT FOREIGN KEY REFERENCES users(id),
    airport_id INT FOREIGN KEY REFERENCES airports(id),
    dropoff_location_id INT FOREIGN KEY REFERENCES dropoff_locations(id),
    pickup_date DATETIME NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    status NVARCHAR(20) DEFAULT 'pending'
); 