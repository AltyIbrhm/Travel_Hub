const { getConnection } = require('../../server/config/database');

class ReservationModel {
  static async createReservation(reservationData) {
    const pool = await getConnection();
    try {
      const result = await pool.request()
        .input('user_id', reservationData.user_id)
        .input('airport_id', reservationData.airport_id)
        .input('dropoff_location_id', reservationData.dropoff_location_id)
        .input('pickup_date', reservationData.pickup_date)
        .input('flight_number', reservationData.flight_number)
        .query(`
          INSERT INTO reservations (user_id, airport_id, dropoff_location_id, pickup_date, flight_number)
          OUTPUT INSERTED.*
          VALUES (@user_id, @airport_id, @dropoff_location_id, @pickup_date, @flight_number)
        `);
      return result.recordset[0];
    } finally {
      pool.close();
    }
  }

  static async getReservationsByUserId(userId) {
    const pool = await getConnection();
    try {
      const result = await pool.request()
        .input('user_id', userId)
        .query(`
          SELECT 
            r.*,
            a.name as airport_name,
            a.code as airport_code,
            d.name as dropoff_name,
            d.address as dropoff_address
          FROM reservations r
          JOIN airports a ON r.airport_id = a.id
          JOIN dropoff_locations d ON r.dropoff_location_id = d.id
          WHERE r.user_id = @user_id
          ORDER BY r.pickup_date DESC
        `);
      return result.recordset;
    } finally {
      pool.close();
    }
  }
}

module.exports = ReservationModel; 