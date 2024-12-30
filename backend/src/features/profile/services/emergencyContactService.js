const sql = require('mssql');
const { getConnection } = require('../../../config/database');

class EmergencyContactService {
  async getEmergencyContact(userId) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('userId', sql.Int, userId)
        .query(`
          SELECT 
            EmergencyContactID,
            UserID,
            EmergencyName,
            EmergencyPhone,
            EmergencyRelationship,
            CreatedAt,
            UpdatedAt
          FROM EmergencyContacts
          WHERE UserID = @userId
        `);
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error in getEmergencyContact:', error);
      throw error;
    }
  }

  async createEmergencyContactRaw(contactData) {
    try {
      const pool = await getConnection();
      
      const result = await pool.request()
        .input('userId', sql.Int, contactData.userId)
        .input('emergencyName', sql.NVarChar(100), contactData.emergencyName || '')
        .input('emergencyPhone', sql.NVarChar(20), contactData.emergencyPhone || '')
        .input('emergencyRelationship', sql.NVarChar(20), contactData.emergencyRelationship || '')
        .query(`
          INSERT INTO EmergencyContacts (
            UserID,
            EmergencyName,
            EmergencyPhone,
            EmergencyRelationship,
            CreatedAt,
            UpdatedAt
          )
          OUTPUT 
            INSERTED.EmergencyContactID,
            INSERTED.UserID,
            INSERTED.EmergencyName,
            INSERTED.EmergencyPhone,
            INSERTED.EmergencyRelationship,
            INSERTED.CreatedAt,
            INSERTED.UpdatedAt
          VALUES (
            @userId,
            @emergencyName,
            @emergencyPhone,
            @emergencyRelationship,
            GETDATE(),
            GETDATE()
          );
        `);
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error in createEmergencyContactRaw:', error);
      throw error;
    }
  }

  async createEmergencyContact(contactData) {
    try {
      const pool = await getConnection();
      
      const sanitizedData = {
        EmergencyName: (contactData.emergencyName || '').substring(0, 100),
        EmergencyPhone: (contactData.emergencyPhone || '').substring(0, 20),
        EmergencyRelationship: (contactData.emergencyRelationship || '').substring(0, 20)
      };
      
      const result = await pool.request()
        .input('userId', sql.Int, contactData.userId)
        .input('emergencyName', sql.NVarChar(100), sanitizedData.EmergencyName)
        .input('emergencyPhone', sql.NVarChar(20), sanitizedData.EmergencyPhone)
        .input('emergencyRelationship', sql.NVarChar(20), sanitizedData.EmergencyRelationship)
        .query(`
          DECLARE @Output TABLE (
            EmergencyContactID INT,
            UserID INT,
            EmergencyName NVARCHAR(100),
            EmergencyPhone NVARCHAR(20),
            EmergencyRelationship NVARCHAR(20),
            CreatedAt DATETIME,
            UpdatedAt DATETIME
          );

          INSERT INTO EmergencyContacts (
            UserID,
            EmergencyName,
            EmergencyPhone,
            EmergencyRelationship,
            CreatedAt,
            UpdatedAt
          )
          OUTPUT 
            INSERTED.EmergencyContactID,
            INSERTED.UserID,
            INSERTED.EmergencyName,
            INSERTED.EmergencyPhone,
            INSERTED.EmergencyRelationship,
            INSERTED.CreatedAt,
            INSERTED.UpdatedAt
          INTO @Output
          VALUES (
            @userId,
            @emergencyName,
            @emergencyPhone,
            @emergencyRelationship,
            GETDATE(),
            GETDATE()
          );

          SELECT * FROM @Output;
        `);
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error in createEmergencyContact:', error);
      throw error;
    }
  }

  async updateEmergencyContact(userId, contactData) {
    try {
      const pool = await getConnection();
      
      const sanitizedData = {
        EmergencyName: (contactData.emergencyName || '').substring(0, 100),
        EmergencyPhone: (contactData.emergencyPhone || '').substring(0, 20),
        EmergencyRelationship: (contactData.emergencyRelationship || '').substring(0, 20)
      };
      
      const result = await pool.request()
        .input('userId', sql.Int, userId)
        .input('emergencyName', sql.NVarChar(100), sanitizedData.EmergencyName)
        .input('emergencyPhone', sql.NVarChar(20), sanitizedData.EmergencyPhone)
        .input('emergencyRelationship', sql.NVarChar(20), sanitizedData.EmergencyRelationship)
        .query(`
          DECLARE @Output TABLE (
            EmergencyContactID INT,
            UserID INT,
            EmergencyName NVARCHAR(100),
            EmergencyPhone NVARCHAR(20),
            EmergencyRelationship NVARCHAR(20),
            CreatedAt DATETIME,
            UpdatedAt DATETIME
          );

          UPDATE EmergencyContacts
          SET 
            EmergencyName = @emergencyName,
            EmergencyPhone = @emergencyPhone,
            EmergencyRelationship = @emergencyRelationship,
            UpdatedAt = GETDATE()
          OUTPUT 
            INSERTED.EmergencyContactID,
            INSERTED.UserID,
            INSERTED.EmergencyName,
            INSERTED.EmergencyPhone,
            INSERTED.EmergencyRelationship,
            INSERTED.CreatedAt,
            INSERTED.UpdatedAt
          INTO @Output
          WHERE UserID = @userId;

          SELECT * FROM @Output;
        `);
      
      if (!result.recordset[0]) {
        return this.createEmergencyContact({
          userId,
          emergencyName: sanitizedData.EmergencyName,
          emergencyPhone: sanitizedData.EmergencyPhone,
          emergencyRelationship: sanitizedData.EmergencyRelationship
        });
      }
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error in updateEmergencyContact:', error);
      throw error;
    }
  }

  async deleteEmergencyContact(userId) {
    try {
      const pool = await getConnection();
      await pool.request()
        .input('userId', sql.Int, userId)
        .query('DELETE FROM EmergencyContacts WHERE UserID = @userId');
    } catch (error) {
      console.error('Error in deleteEmergencyContact:', error);
      throw error;
    }
  }
}

module.exports = new EmergencyContactService(); 