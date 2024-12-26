USE [transportation_db];
GO

-- Drop any existing foreign key constraints
DECLARE @sql NVARCHAR(MAX) = '';
SELECT @sql = @sql + 'ALTER TABLE ' + QUOTENAME(OBJECT_SCHEMA_NAME(parent_object_id))
    + '.' + QUOTENAME(OBJECT_NAME(parent_object_id)) 
    + ' DROP CONSTRAINT ' + QUOTENAME(name) + ';'
FROM sys.foreign_keys
WHERE referenced_object_id = OBJECT_ID('dbo.Reservations');

IF @sql > ''
BEGIN
    EXEC sp_executesql @sql;
END

-- Force drop the table if it exists
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Reservations]') AND type in (N'U'))
BEGIN
    DROP TABLE [dbo].[Reservations];
    PRINT 'Dropped existing Reservations table';
END

-- Create the table with all required columns
CREATE TABLE [dbo].[Reservations] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [user_id] BIGINT NOT NULL,
    [pickup_location] NVARCHAR(255) NOT NULL,
    [dropoff_location] NVARCHAR(255) NOT NULL,
    [pickup_date] DATETIME NOT NULL,
    [vehicle_type] NVARCHAR(50) NOT NULL,
    [passengers] INT NOT NULL DEFAULT 1,
    [luggage] INT NOT NULL DEFAULT 0,
    [distance] FLOAT NOT NULL DEFAULT 0,
    [total_cost] DECIMAL(9,2) NOT NULL DEFAULT 0,
    [base_fare] DECIMAL(9,2) NOT NULL DEFAULT 0,
    [vehicle_surcharge] DECIMAL(9,2) NOT NULL DEFAULT 0,
    [airport_fee] DECIMAL(9,2) NOT NULL DEFAULT 0,
    [luggage_fee] DECIMAL(9,2) NOT NULL DEFAULT 0,
    [status] NVARCHAR(50) NOT NULL DEFAULT 'pending',
    [created_at] DATETIME NOT NULL DEFAULT GETDATE()
);
GO

PRINT 'Created new Reservations table with updated schema';

-- Verify the table structure
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Reservations'
ORDER BY ORDINAL_POSITION;
GO 