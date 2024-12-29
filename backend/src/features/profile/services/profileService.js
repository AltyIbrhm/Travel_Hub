const sql = require('mssql');
const { getConnection } = require('../../../config/database');

class ProfileService {
  async getProfile(userId) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('userId', sql.Int, userId)
        .query(`
          SELECT 
            ProfileID,
            UserID,
            FirstName,
            LastName,
            Email,
            PhoneNumber,
            DateOfBirth,
            Language,
            Address,
            ProfilePicture,
            CreatedAt,
            UpdatedAt
          FROM Profiles
          WHERE UserID = @userId
        `);
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error in getProfile:', error);
      throw error;
    }
  }

  async createProfile(profileData) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('userId', sql.Int, profileData.userId)
        .input('firstName', sql.NVarChar(50), profileData.firstName)
        .input('lastName', sql.NVarChar(50), profileData.lastName)
        .input('email', sql.NVarChar(100), profileData.email)
        .input('phoneNumber', sql.NVarChar(20), profileData.phoneNumber)
        .input('dateOfBirth', sql.Date, new Date(profileData.dateOfBirth))
        .input('language', sql.NVarChar(20), profileData.language)
        .input('address', sql.NVarChar(255), profileData.address)
        .input('profilePicture', sql.NVarChar(255), profileData.profilePicture)
        .query(`
          INSERT INTO Profiles (
            UserID,
            FirstName,
            LastName,
            Email,
            PhoneNumber,
            DateOfBirth,
            Language,
            Address,
            ProfilePicture
          )
          VALUES (
            @userId,
            @firstName,
            @lastName,
            @email,
            @phoneNumber,
            @dateOfBirth,
            @language,
            @address,
            @profilePicture
          );
          
          SELECT SCOPE_IDENTITY() AS ProfileID;
        `);
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error in createProfile:', error);
      throw error;
    }
  }

  async updateProfile(userId, profileData) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('userId', sql.Int, userId)
        .input('firstName', sql.NVarChar(50), profileData.firstName)
        .input('lastName', sql.NVarChar(50), profileData.lastName)
        .input('phoneNumber', sql.NVarChar(20), profileData.phoneNumber)
        .input('dateOfBirth', sql.Date, new Date(profileData.dateOfBirth))
        .input('language', sql.NVarChar(20), profileData.language)
        .input('address', sql.NVarChar(255), profileData.address)
        .input('profilePicture', sql.NVarChar(255), profileData.profilePicture)
        .query(`
          UPDATE Profiles
          SET
            FirstName = @firstName,
            LastName = @lastName,
            PhoneNumber = @phoneNumber,
            DateOfBirth = @dateOfBirth,
            Language = @language,
            Address = @address,
            ProfilePicture = @profilePicture
          WHERE UserID = @userId;
          
          SELECT * FROM Profiles WHERE UserID = @userId;
        `);
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error;
    }
  }

  async deleteProfile(userId) {
    try {
      const pool = await getConnection();
      await pool.request()
        .input('userId', sql.Int, userId)
        .query('DELETE FROM Profiles WHERE UserID = @userId');
      
      return true;
    } catch (error) {
      console.error('Error in deleteProfile:', error);
      throw error;
    }
  }
}

module.exports = new ProfileService(); 