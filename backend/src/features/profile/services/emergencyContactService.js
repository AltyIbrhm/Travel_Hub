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

  async createEmergencyContact(contactData) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('userId', sql.Int, contactData.userId)
        .input('emergencyName', sql.NVarChar(100), contactData.emergencyName)
        .input('emergencyPhone', sql.NVarChar(20), contactData.emergencyPhone)
        .input('emergencyRelationship', sql.NVarChar(20), contactData.emergencyRelationship)
        .query(`
          INSERT INTO EmergencyContacts (
            UserID,
            EmergencyName,
            EmergencyPhone,
            EmergencyRelationship
          )
          VALUES (
            @userId,
            @emergencyName,
            @emergencyPhone,
            @emergencyRelationship
          );
          
          SELECT SCOPE_IDENTITY() AS EmergencyContactID;
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
      const result = await pool.request()
        .input('userId', sql.Int, userId)
        .input('emergencyName', sql.NVarChar(100), contactData.emergencyName)
        .input('emergencyPhone', sql.NVarChar(20), contactData.emergencyPhone)
        .input('emergencyRelationship', sql.NVarChar(20), contactData.emergencyRelationship)
        .query(`
          UPDATE EmergencyContacts
          SET
            EmergencyName = @emergencyName,
            EmergencyPhone = @emergencyPhone,
            EmergencyRelationship = @emergencyRelationship
          WHERE UserID = @userId;
          
          SELECT * FROM EmergencyContacts WHERE UserID = @userId;
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
      
      return true;
    } catch (error) {
      console.error('Error in deleteEmergencyContact:', error);
      throw error;
    }
  }
}

module.exports = new EmergencyContactService(); 