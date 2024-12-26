const { getConnection } = require('../../server/config/database');

class AirportModel {
  static async getAllAirports() {
    const pool = await getConnection();
    try {
      const result = await pool.request()
        .query('SELECT * FROM airports ORDER BY name');
      return result.recordset;
    } finally {
      pool.close();
    }
  }

  static async getAirportById(id) {
    const pool = await getConnection();
    try {
      const result = await pool.request()
        .input('id', id)
        .query('SELECT * FROM airports WHERE id = @id');
      return result.recordset[0];
    } finally {
      pool.close();
    }
  }
}

module.exports = AirportModel; 