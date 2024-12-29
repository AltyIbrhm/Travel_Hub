const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { getConnection } = require('../config/database');

// Initialize database tables
router.post('/init-db', async (req, res) => {
  try {
    console.log('Starting database initialization...');
    const pool = await getConnection();

    // Create Profiles table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Profiles]') AND type in (N'U'))
      BEGIN
          CREATE TABLE [dbo].[Profiles] (
              [ProfileID] INT IDENTITY(1,1) PRIMARY KEY,
              [UserID] INT NOT NULL,
              [FirstName] NVARCHAR(50),
              [LastName] NVARCHAR(50),
              [Email] NVARCHAR(100),
              [PhoneNumber] NVARCHAR(20),
              [DateOfBirth] DATE,
              [Language] NVARCHAR(20),
              [Address] NVARCHAR(255),
              [ProfilePicture] NVARCHAR(255),
              [CreatedAt] DATETIME DEFAULT GETDATE(),
              [UpdatedAt] DATETIME DEFAULT GETDATE()
          );
      END
    `);
    console.log('Profiles table created/verified');

    // Create EmergencyContacts table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[EmergencyContacts]') AND type in (N'U'))
      BEGIN
          CREATE TABLE [dbo].[EmergencyContacts] (
              [EmergencyContactID] INT IDENTITY(1,1) PRIMARY KEY,
              [UserID] INT NOT NULL,
              [Name] NVARCHAR(100),
              [Phone] NVARCHAR(20),
              [Relationship] NVARCHAR(20),
              [CreatedAt] DATETIME DEFAULT GETDATE(),
              [UpdatedAt] DATETIME DEFAULT GETDATE()
          );
      END
    `);
    console.log('EmergencyContacts table created/verified');

    // Add foreign key constraints
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_Profiles_Users]') AND parent_object_id = OBJECT_ID(N'[dbo].[Profiles]'))
      BEGIN
          ALTER TABLE [dbo].[Profiles]
          ADD CONSTRAINT [FK_Profiles_Users] FOREIGN KEY ([UserID])
          REFERENCES [dbo].[Users] ([UserID])
          ON DELETE CASCADE;
      END

      IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_EmergencyContacts_Users]') AND parent_object_id = OBJECT_ID(N'[dbo].[EmergencyContacts]'))
      BEGIN
          ALTER TABLE [dbo].[EmergencyContacts]
          ADD CONSTRAINT [FK_EmergencyContacts_Users] FOREIGN KEY ([UserID])
          REFERENCES [dbo].[Users] ([UserID])
          ON DELETE CASCADE;
      END
    `);
    console.log('Foreign key constraints added/verified');

    res.json({
      status: 'success',
      message: 'Database initialized successfully'
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to initialize database',
      details: error.message
    });
  }
});

module.exports = router; 