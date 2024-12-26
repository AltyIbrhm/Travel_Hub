const { getConnection } = require('../../server/config/database');

class RouteModel {
  static async getAllRoutes() {
    const pool = await getConnection();
    try {
      const result = await pool.request().query('SELECT * FROM routes');
      return result.recordset;
    } finally {
      pool.close();
    }
  }
}

module.exports = RouteModel; 