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
            emergencyName,
            emergencyPhone,
            emergencyRelationship,
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

  // Raw emergency contact creation that bypasses validation
  async createEmergencyContactRaw(contactData) {
    try {
      const pool = await getConnection();
      
      // Insert the emergency contact directly
      const result = await pool.request()
        .input('userId', sql.Int, contactData.userId)
        .input('emergencyName', sql.NVarChar(100), contactData.emergencyName || '')
        .input('emergencyPhone', sql.NVarChar(20), contactData.emergencyPhone || '')
        .input('emergencyRelationship', sql.NVarChar(20), contactData.emergencyRelationship || '')
        .query(`
          INSERT INTO EmergencyContacts (
            UserID,
            emergencyName,
            emergencyPhone,
            emergencyRelationship,
            CreatedAt,
            UpdatedAt
          )
          OUTPUT 
            INSERTED.EmergencyContactID,
            INSERTED.UserID,
            INSERTED.emergencyName,
            INSERTED.emergencyPhone,
            INSERTED.emergencyRelationship,
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
      
      // Validate data here if needed
      
      // Insert the emergency contact
      const result = await pool.request()
        .input('userId', sql.Int, contactData.userId)
        .input('emergencyName', sql.NVarChar(100), contactData.emergencyName)
        .input('emergencyPhone', sql.NVarChar(20), contactData.emergencyPhone)
        .input('emergencyRelationship', sql.NVarChar(20), contactData.emergencyRelationship)
        .query(`
          INSERT INTO EmergencyContacts (
            UserID,
            emergencyName,
            emergencyPhone,
            emergencyRelationship,
            CreatedAt,
            UpdatedAt
          )
          OUTPUT 
            INSERTED.EmergencyContactID,
            INSERTED.UserID,
            INSERTED.emergencyName,
            INSERTED.emergencyPhone,
            INSERTED.emergencyRelationship,
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
      console.error('Error in createEmergencyContact:', error);
      throw error;
    }
  }

  async updateEmergencyContact(userId, contactData) {
    try {
      const pool = await getConnection();
      
      // Update the emergency contact
      const result = await pool.request()
        .input('userId', sql.Int, userId)
        .input('emergencyName', sql.NVarChar(100), contactData.emergencyName)
        .input('emergencyPhone', sql.NVarChar(20), contactData.emergencyPhone)
        .input('emergencyRelationship', sql.NVarChar(20), contactData.emergencyRelationship)
        .query(`
          UPDATE EmergencyContacts
          SET 
            emergencyName = @emergencyName,
            emergencyPhone = @emergencyPhone,
            emergencyRelationship = @emergencyRelationship,
            UpdatedAt = GETDATE()
          OUTPUT 
            INSERTED.EmergencyContactID,
            INSERTED.UserID,
            INSERTED.emergencyName,
            INSERTED.emergencyPhone,
            INSERTED.emergencyRelationship,
            INSERTED.CreatedAt,
            INSERTED.UpdatedAt
          WHERE UserID = @userId;
        `);
      
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