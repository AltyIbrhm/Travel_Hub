const { getConnection } = require('../../server/config/database');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

class AuthModel {
  static async createUser(userData) {
    const pool = await getConnection();
    try {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const result = await pool.request()
        .input('email', userData.email)
        .input('password', hashedPassword)
        .input('first_name', userData.first_name)
        .input('last_name', userData.last_name)
        .query(`
          INSERT INTO users (email, password, first_name, last_name)
          OUTPUT INSERTED.id, INSERTED.email, INSERTED.first_name, INSERTED.last_name, INSERTED.created_at
          VALUES (@email, @password, @first_name, @last_name)
        `);
      
      return result.recordset[0];
    } finally {
      pool.close();
    }
  }

  static async loginUser(email, password) {
    const pool = await getConnection();
    try {
      const result = await pool.request()
        .input('email', email)
        .query('SELECT * FROM users WHERE email = @email');

      const user = result.recordset[0];
      if (!user) {
        return null;
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return null;
      }

      // Don't send password back
      delete user.password;
      return user;
    } finally {
      pool.close();
    }
  }

  static async createPasswordResetToken(email, resetToken) {
    const pool = await getConnection();
    try {
      // Check if user exists
      const userResult = await pool.request()
        .input('email', email)
        .query('SELECT id FROM users WHERE email = @email');

      if (userResult.recordset.length === 0) {
        return null;
      }

      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

      // Save reset token
      await pool.request()
        .input('email', email)
        .input('reset_token', resetToken)
        .input('reset_token_expiry', resetTokenExpiry)
        .query(`
          UPDATE users 
          SET reset_token = @reset_token, 
              reset_token_expiry = @reset_token_expiry 
          WHERE email = @email
        `);

      return { success: true };
    } finally {
      pool.close();
    }
  }

  static async verifyResetToken(token) {
    const pool = await getConnection();
    try {
      const result = await pool.request()
        .input('token', token)
        .input('now', new Date())
        .query(`
          SELECT id 
          FROM users 
          WHERE reset_token = @token 
          AND reset_token_expiry > @now
        `);

      return result.recordset.length > 0;
    } finally {
      pool.close();
    }
  }

  static async resetPassword(token, newPassword) {
    const pool = await getConnection();
    try {
      // Find user with valid reset token
      const result = await pool.request()
        .input('token', token)
        .input('now', new Date())
        .query(`
          SELECT id 
          FROM users 
          WHERE reset_token = @token 
          AND reset_token_expiry > @now
        `);

      if (result.recordset.length === 0) {
        return null;
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password and clear reset token
      await pool.request()
        .input('id', result.recordset[0].id)
        .input('password', hashedPassword)
        .query(`
          UPDATE users 
          SET password = @password,
              reset_token = NULL,
              reset_token_expiry = NULL
          WHERE id = @id
        `);

      return { success: true };
    } finally {
      pool.close();
    }
  }
}

module.exports = AuthModel; 