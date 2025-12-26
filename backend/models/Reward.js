const { executeQuery } = require('../config/database');

class Reward {
  // Add reward transaction
  static async addTransaction({
    userId,
    bookingId = null,
    points,
    transactionType,
    description
  }) {
    // Get current balance
    const currentBalance = await this.getCurrentBalance(userId);
    const balanceAfter = currentBalance + points;
    
    const sql = `
      INSERT INTO reward_transactions 
      (user_id, booking_id, points, transaction_type, description, balance_after)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    await executeQuery(sql, [
      userId,
      bookingId,
      points,
      transactionType,
      description,
      balanceAfter
    ]);
    
    return balanceAfter;
  }

  // Get current balance
  static async getCurrentBalance(userId) {
    const sql = `
      SELECT total_points 
      FROM users 
      WHERE id = ?
    `;
    
    const results = await executeQuery(sql, [userId]);
    return results[0]?.total_points || 0;
  }

  // Get transaction history
  static async getTransactionHistory(userId, limit = 10, offset = 0) {
    const sql = `
      SELECT 
        rt.*,
        DATE_FORMAT(rt.created_at, '%Y-%m-%d %H:%i:%s') as formatted_date,
        b.booking_reference,
        CASE 
          WHEN rt.points > 0 THEN 'credit'
          ELSE 'debit'
        END as point_type
      FROM reward_transactions rt
      LEFT JOIN bookings b ON rt.booking_id = b.id
      WHERE rt.user_id = ?
      ORDER BY rt.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    return await executeQuery(sql, [userId, limit, offset]);
  }

  // Calculate carbon saved (example: 1kg e-waste = 2kg CO2 saved)
  static calculateCarbonSaved(weightKg) {
    return weightKg * 2; // This is an estimate
  }

  // Get user statistics
  static async getUserStats(userId) {
    const sql = `
      SELECT 
        u.total_points as current_points,
        COALESCE(SUM(CASE WHEN rt.points > 0 THEN rt.points ELSE 0 END), 0) as total_earned,
        COALESCE(SUM(CASE WHEN rt.points < 0 THEN -rt.points ELSE 0 END), 0) as total_spent,
        COUNT(DISTINCT rt.booking_id) as bookings_with_points
      FROM users u
      LEFT JOIN reward_transactions rt ON u.id = rt.user_id
      WHERE u.id = ?
    `;
    
    const results = await executeQuery(sql, [userId]);
    return results[0];
  }
}

module.exports = Reward;