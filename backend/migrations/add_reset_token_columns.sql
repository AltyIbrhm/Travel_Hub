USE [travelhub_db]
GO

-- Check if resetToken column exists and add it if it doesn't
IF COL_LENGTH('Users', 'resetToken') IS NULL
BEGIN
    ALTER TABLE Users
    ADD resetToken NVARCHAR(MAX) NULL
END
GO

-- Check if resetTokenExpiry column exists and add it if it doesn't
IF COL_LENGTH('Users', 'resetTokenExpiry') IS NULL
BEGIN
    ALTER TABLE Users
    ADD resetTokenExpiry DATETIME NULL
END
GO 