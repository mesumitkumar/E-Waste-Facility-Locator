const db = require('../config/database');

class Booking {
  static generateReference() {
    const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const randomPart = Math.floor(100000 + Math.random() * 900000);
    return `EW${datePart}${randomPart}`;
  }

  static async create(bookingData) {
    const { userId, deviceType, quantity, weight, pickupAddress, pickupDate, pickupTimeSlot, specialInstructions } = bookingData;
    
    const bookingReference = this.generateReference();
    const pointsEarned = Math.round(weight * 30);
    
    const [result] = await db.query(
      `INSERT INTO bookings (user_id, booking_reference, device_type, quantity, weight, pickup_address, pickup_date, pickup_time_slot, special_instructions, points_earned)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, bookingReference, deviceType, quantity, weight, pickupAddress, pickupDate, pickupTimeSlot, specialInstructions, pointsEarned]
    );
    
    return {
      id: result.insertId,
      bookingReference,
      pointsEarned
    };
  }

  static async findByUserId(userId) {
    const [rows] = await db.query(
      'SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  }
}

module.exports = Booking;