-- Drop the table if it exists
IF OBJECT_ID('dbo.Reservations', 'U') IS NOT NULL
    DROP TABLE dbo.Reservations;
GO

-- Create Reservations table with correct column names
CREATE TABLE dbo.Reservations (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    pickup_location NVARCHAR(510) NOT NULL,
    dropoff_location NVARCHAR(510) NOT NULL,
    pickup_date DATETIME NOT NULL,
    vehicle_type NVARCHAR(100) NOT NULL,
    passengers INT NOT NULL,
    luggage INT NOT NULL,
    distance FLOAT NOT NULL,
    totalcost DECIMAL(9,2) NOT NULL,
    basefare DECIMAL(9,2) NOT NULL,
    vehiclesurcharge DECIMAL(9,2) NOT NULL,
    airportfee DECIMAL(9,2) NOT NULL,
    luggagefee DECIMAL(9,2) NOT NULL,
    status NVARCHAR(100) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NULL
);

-- Add foreign key constraint
ALTER TABLE dbo.Reservations
ADD CONSTRAINT FK_Reservations_Users
FOREIGN KEY (user_id) REFERENCES dbo.Users(id); 