-- Drop and recreate luggage_fee column to ensure correct naming
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Reservations') AND name = 'luggagefee')
BEGIN
    EXEC sp_rename 'Reservations.luggagefee', 'luggage_fee', 'COLUMN';
END

-- Add missing columns if they don't exist
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Reservations') AND name = 'pickup_location')
BEGIN
    ALTER TABLE Reservations ADD pickup_location NVARCHAR(255) NOT NULL DEFAULT '';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Reservations') AND name = 'dropoff_location')
BEGIN
    ALTER TABLE Reservations ADD dropoff_location NVARCHAR(255) NOT NULL DEFAULT '';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Reservations') AND name = 'vehicle_type')
BEGIN
    ALTER TABLE Reservations ADD vehicle_type NVARCHAR(50) NOT NULL DEFAULT 'sedan';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Reservations') AND name = 'passengers')
BEGIN
    ALTER TABLE Reservations ADD passengers INT NOT NULL DEFAULT 1;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Reservations') AND name = 'luggage')
BEGIN
    ALTER TABLE Reservations ADD luggage INT NOT NULL DEFAULT 0;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Reservations') AND name = 'distance')
BEGIN
    ALTER TABLE Reservations ADD distance FLOAT NOT NULL DEFAULT 0;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Reservations') AND name = 'total_cost')
BEGIN
    ALTER TABLE Reservations ADD total_cost DECIMAL(9,2) NOT NULL DEFAULT 0;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Reservations') AND name = 'base_fare')
BEGIN
    ALTER TABLE Reservations ADD base_fare DECIMAL(9,2) NOT NULL DEFAULT 0;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Reservations') AND name = 'vehicle_surcharge')
BEGIN
    ALTER TABLE Reservations ADD vehicle_surcharge DECIMAL(9,2) NOT NULL DEFAULT 0;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Reservations') AND name = 'airport_fee')
BEGIN
    ALTER TABLE Reservations ADD airport_fee DECIMAL(9,2) NOT NULL DEFAULT 0;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Reservations') AND name = 'luggage_fee')
BEGIN
    ALTER TABLE Reservations ADD luggage_fee DECIMAL(9,2) NOT NULL DEFAULT 0;
END

-- Add updated_at column if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Reservations') AND name = 'updated_at')
BEGIN
    ALTER TABLE Reservations ADD updated_at DATETIME NULL DEFAULT GETDATE();
END

-- Drop old columns if they exist
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Reservations') AND name = 'airport_id')
BEGIN
    ALTER TABLE Reservations DROP COLUMN airport_id;
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Reservations') AND name = 'dropoff_location_id')
BEGIN
    ALTER TABLE Reservations DROP COLUMN dropoff_location_id;
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Reservations') AND name = 'flight_number')
BEGIN
    ALTER TABLE Reservations DROP COLUMN flight_number;
END 