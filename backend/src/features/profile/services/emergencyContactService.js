const sql = require('mssql');
const { getConnection } = require('../../../config/database');

class EmergencyContactService {
  // Define valid relationships exactly as per database constraint
  static VALID_RELATIONSHIPS = ['Other', 'Friend', 'Sibling', 'Spouse', 'Parent'];
  static DEFAULT_RELATIONSHIP = 'Other';

  validateRelationship(relationship) {
    // Handle empty values or "Select relationship"
    if (!relationship || relationship.trim() === 'Select relationship') {
      return this.constructor.DEFAULT_RELATIONSHIP;
    }
    
    // Use exact case matching as per database constraint
    const validRelationship = this.constructor.VALID_RELATIONSHIPS.find(
      r => r === relationship.trim()
    );
    return validRelationship || this.constructor.DEFAULT_RELATIONSHIP;
  }

  async getEmergencyContact(userId) {
    try {
      console.log('Getting emergency contact for userId:', userId);
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
      
      console.log('Emergency contact query result:', result.recordset[0]);
      return result.recordset[0];
    } catch (error) {
      console.error('Error getting emergency contact:', error);
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
      throw error;
    }
  }

  async createEmergencyContact(contactData) {
    try {
      const pool = await getConnection();
      
      // Ensure valid relationship with exact case matching
      const validatedRelationship = this.validateRelationship(contactData.emergencyRelationship);
      
      const sanitizedData = {
        EmergencyName: (contactData.emergencyName || '').substring(0, 100),
        EmergencyPhone: (contactData.emergencyPhone || '').substring(0, 20),
        EmergencyRelationship: validatedRelationship
      };
      
      console.log('Creating emergency contact with data:', sanitizedData);
      
      const result = await pool.request()
        .input('userId', sql.Int, contactData.userId)
        .input('emergencyName', sql.NVarChar(100), sanitizedData.EmergencyName)
        .input('emergencyPhone', sql.NVarChar(20), sanitizedData.EmergencyPhone)
        .input('emergencyRelationship', sql.NVarChar(40), sanitizedData.EmergencyRelationship)
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

      console.log('Created emergency contact:', result.recordset[0]);
      return result.recordset[0];
    } catch (error) {
      console.error('Error creating emergency contact:', error);
      throw error;
    }
  }

  async updateEmergencyContact(userId, contactData) {
    try {
      const pool = await getConnection();
      
      // Only name is required, other fields are optional
      if (!contactData.emergencyName?.trim()) {
        throw new Error('Emergency contact name is required');
      }

      // Ensure valid relationship with exact case matching
      const validatedRelationship = this.validateRelationship(contactData.emergencyRelationship);
      
      const sanitizedData = {
        EmergencyName: contactData.emergencyName.trim().substring(0, 100),
        EmergencyPhone: (contactData.emergencyPhone || '').substring(0, 20),
        EmergencyRelationship: validatedRelationship
      };
      
      console.log('Sanitized emergency contact data:', sanitizedData);
      
      const result = await pool.request()
        .input('userId', sql.Int, userId)
        .input('emergencyName', sql.NVarChar(100), sanitizedData.EmergencyName)
        .input('emergencyPhone', sql.NVarChar(20), sanitizedData.EmergencyPhone)
        .input('emergencyRelationship', sql.NVarChar(40), sanitizedData.EmergencyRelationship)
        .query(`
          DECLARE @Output TABLE (
            EmergencyContactID INT,
            UserID INT,
            EmergencyName NVARCHAR(100),
            EmergencyPhone NVARCHAR(20),
            EmergencyRelationship NVARCHAR(40),
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
        console.log('No existing emergency contact found, creating new one');
        return this.createEmergencyContact({
          userId,
          emergencyName: sanitizedData.EmergencyName,
          emergencyPhone: sanitizedData.EmergencyPhone,
          emergencyRelationship: sanitizedData.EmergencyRelationship
        });
      }
      
      console.log('Updated emergency contact:', result.recordset[0]);
      return result.recordset[0];
    } catch (error) {
      console.error('Error updating emergency contact:', error);
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
      throw error;
    }
  }
}

module.exports = new EmergencyContactService(); 