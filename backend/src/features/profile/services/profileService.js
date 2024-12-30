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

  // Raw profile creation that bypasses validation
  async createProfileRaw(profileData) {
    try {
      const pool = await getConnection();
      
      // Insert the profile directly
      const result = await pool.request()
        .input('userId', sql.Int, profileData.userId)
        .input('firstName', sql.NVarChar(50), profileData.firstName || '')
        .input('lastName', sql.NVarChar(50), profileData.lastName || '')
        .input('email', sql.NVarChar(100), profileData.email || '')
        .input('phoneNumber', sql.NVarChar(20), profileData.phoneNumber || '')
        .input('dateOfBirth', sql.Date, profileData.dateOfBirth || new Date('2000-01-01'))
        .input('language', sql.NVarChar(20), profileData.language || 'English')
        .input('address', sql.NVarChar(255), profileData.address || '')
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
            ProfilePicture,
            CreatedAt,
            UpdatedAt
          )
          OUTPUT 
            INSERTED.ProfileID,
            INSERTED.UserID,
            INSERTED.FirstName,
            INSERTED.LastName,
            INSERTED.Email,
            INSERTED.PhoneNumber,
            INSERTED.DateOfBirth,
            INSERTED.Language,
            INSERTED.Address,
            INSERTED.ProfilePicture,
            INSERTED.CreatedAt,
            INSERTED.UpdatedAt
          VALUES (
            @userId,
            @firstName,
            @lastName,
            @email,
            @phoneNumber,
            @dateOfBirth,
            @language,
            @address,
            @profilePicture,
            GETDATE(),
            GETDATE()
          );
        `);
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error in createProfileRaw:', error);
      throw error;
    }
  }

  async createProfile(profileData) {
    try {
      const pool = await getConnection();
      
      // Create the profile
      const createResult = await pool.request()
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
      
      const profileId = createResult.recordset[0].ProfileID;
      
      // Fetch the created profile
      const getResult = await pool.request()
        .input('profileId', sql.Int, profileId)
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
          WHERE ProfileID = @profileId
        `);
      
      return getResult.recordset[0];
    } catch (error) {
      console.error('Error in createProfile:', error);
      throw error;
    }
  }

  async updateProfile(userId, profileData) {
    try {
      const pool = await getConnection();
      const request = pool.request()
        .input('userId', sql.Int, userId);

      // Build the update query dynamically based on provided fields
      let updateFields = [];
      let queryParams = [];

      if (profileData.firstName !== undefined) {
        request.input('firstName', sql.NVarChar(50), profileData.firstName);
        updateFields.push('FirstName = @firstName');
      }
      if (profileData.lastName !== undefined) {
        request.input('lastName', sql.NVarChar(50), profileData.lastName);
        updateFields.push('LastName = @lastName');
      }
      if (profileData.phoneNumber !== undefined) {
        request.input('phoneNumber', sql.NVarChar(20), profileData.phoneNumber);
        updateFields.push('PhoneNumber = @phoneNumber');
      }
      if (profileData.dateOfBirth !== undefined) {
        request.input('dateOfBirth', sql.Date, new Date(profileData.dateOfBirth));
        updateFields.push('DateOfBirth = @dateOfBirth');
      }
      if (profileData.language !== undefined) {
        request.input('language', sql.NVarChar(20), profileData.language);
        updateFields.push('Language = @language');
      }
      if (profileData.address !== undefined) {
        request.input('address', sql.NVarChar(255), profileData.address);
        updateFields.push('Address = @address');
      }
      if (profileData.profilePicture !== undefined) {
        request.input('profilePicture', sql.NVarChar(255), profileData.profilePicture);
        updateFields.push('ProfilePicture = @profilePicture');
      }

      // If no fields to update, just return the current profile
      if (updateFields.length === 0) {
        const result = await request.query('SELECT * FROM Profiles WHERE UserID = @userId');
        return result.recordset[0];
      }

      const updateQuery = `
        UPDATE Profiles
        SET ${updateFields.join(', ')}
        WHERE UserID = @userId;
        
        SELECT * FROM Profiles WHERE UserID = @userId;
      `;

      const result = await request.query(updateQuery);
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