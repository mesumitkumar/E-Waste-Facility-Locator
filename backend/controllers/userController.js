const db = require('../config/database');

const userController = {
  // Get user dashboard data
  getDashboard: async (req, res) => {
  try {
    const userId = req.user.id;

    const [users] = await db.execute(
      'SELECT id, name, email, phone, address, city, total_points FROM users WHERE id = ?',
      [userId]
    );

    const [bookingStats] = await db.execute(
      `SELECT 
        COUNT(*) as total_bookings,
        COALESCE(SUM(weight), 0) as total_weight_kg,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_bookings,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_bookings
       FROM bookings WHERE user_id = ?`,
      [userId]
    );

    const [recentBookings] = await db.execute(
      `SELECT booking_reference, weight, points_earned, created_at, status
       FROM bookings
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 5`,
      [userId]
    );

    const user = users[0];
    const stats = bookingStats[0];

    res.json({
      success: true,
      dashboard: {
        user: {
          ...user,
          carbonSaved: (stats.total_weight_kg || 0) * 2
        },
        stats: {
          totalPoints: user.total_points,
          totalBookings: stats.total_bookings || 0,
          totalWeight: stats.total_weight_kg || 0,
          completedBookings: stats.completed_bookings || 0,
          pendingBookings: stats.pending_bookings || 0
        },
        recentActivity: recentBookings
      }
    });

  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
},




  // Get user stats
  getStats: async (req, res) => {
    try {
      const userId = req.user.id;

      // Get user points
      const [users] = await db.execute(
        'SELECT total_points FROM users WHERE id = ?',
        [userId]
      );

      // Get booking stats
      const [bookingStats] = await db.execute(
        `SELECT 
          COALESCE(SUM(weight), 0) as total_weight_kg,
          COALESCE(SUM(points_earned), 0) as total_points_earned
         FROM bookings WHERE user_id = ?`,
        [userId]
      );

      res.json({
        success: true,
        stats: {
          currentPoints: users[0].total_points,
          totalWeightRecycled: bookingStats[0].total_weight_kg || 0,
          totalPointsEarned: bookingStats[0].total_points_earned || 0,
          carbonSaved: (bookingStats[0].total_weight_kg || 0) * 2,
          pointsPerKg: 30
        }
      });

    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
};

module.exports = userController;

