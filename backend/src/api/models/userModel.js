const { sql, poolPromise } = require('../../config/db');
const bcrypt = require('bcryptjs');

class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.firstName = data.first_name;
    this.lastName = data.last_name;
    this.createdAt = data.created_at;
    this.phone = data.phone;
    this.address = data.address;
    this.profilePicture = data.profile_picture;
    this.resetToken = data.reset_token;
    this.resetTokenExpiry = data.reset_token_expiry;
  }

  // Convert camelCase to snake_case for database operations
  toDatabase() {
    return {
      email: this.email,
      password: this.password,
      first_name: this.firstName,
      last_name: this.lastName,
      phone: this.phone,
      address: this.address,
      profile_picture: this.profilePicture
    };
  }

  // Remove sensitive data for client response
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      address: this.address,
      profilePicture: this.profilePicture,
      createdAt: this.createdAt
    };
  }
}

module.exports = User; 