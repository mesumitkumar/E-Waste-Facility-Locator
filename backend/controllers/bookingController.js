const db = require('../config/database');

const bookingController = {
  // Create booking
  createBooking: async (req, res) => {
    try {
      const userId = req.user.id;

      const {
        deviceType,
        quantity,
        weight,
        pickupDate,
        pickupTimeSlot,
        specialInstructions,
        flatNo,
        area,
        city,
        state,
        pincode
      } = req.body;

      // Basic validation
      if (
        !deviceType ||
        !weight ||
        !pickupDate ||
        !pickupTimeSlot ||
        !flatNo ||
        !area ||
        !city ||
        !state ||
        !pincode
      ) {
        return res.status(400).json({
          success: false,
          message: 'All required fields must be provided'
        });
      }

      // 1️⃣ Insert pickup address
      const [addressResult] = await db.execute(
        `INSERT INTO pickup_addresses 
         (user_id, flat_no, area, city, state, pincode)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, flatNo, area, city, state, pincode]
      );

      const pickupAddressId = addressResult.insertId;

      // 2️⃣ Generate booking reference
      const datePart = new Date()
        .toISOString()
        .slice(2, 10)
        .replace(/-/g, '');
      const randomPart = Math.floor(100000 + Math.random() * 900000);
      const bookingReference = `EW${datePart}${randomPart}`;

      // 3️⃣ Calculate points (1kg = 30 points)
      const pointsEarned = Math.round(weight * 30);

      // 4️⃣ Create booking with pickup_address_id
      const [bookingResult] = await db.execute(
        `INSERT INTO bookings
         (user_id, booking_reference, device_type, quantity, weight, pickup_address_id,
          pickup_date, pickup_time_slot, special_instructions, points_earned)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          bookingReference,
          deviceType,
          quantity,
          weight,
          pickupAddressId,
          pickupDate,
          pickupTimeSlot,
          specialInstructions || null,
          pointsEarned
        ]
      );

      const bookingId = bookingResult.insertId;

      // 5️⃣ Update user reward points
      await db.execute(
        `UPDATE users 
         SET total_points = total_points + ? 
         WHERE id = ?`,
        [pointsEarned, userId]
      );

      // 6️⃣ Fetch updated user data
      const [userRows] = await db.execute(
        'SELECT id, name, email, total_points FROM users WHERE id = ?',
        [userId]
      );

      // Build full address only for response
      const fullAddress = `${flatNo}, ${area}, ${city}, ${state} - ${pincode}`;

      res.status(201).json({
        success: true,
        message: `Booking confirmed! Your e-waste pickup is scheduled for ${pickupDate} between ${pickupTimeSlot}.`,
        booking: {
          id: bookingId,
          bookingReference,
          deviceType,
          quantity,
          weight,
          pickupDate,
          pickupTimeSlot,
          pickupAddress: fullAddress,
          pointsEarned,
          status: 'pending'
        },
        user: userRows[0]
      });

    } catch (error) {
      console.error('Create booking error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while creating booking'
      });
    }
  },

  // Get user bookings
  getUserBookings: async (req, res) => {
    try {
      const userId = req.user.id;

      const [bookings] = await db.execute(
        `SELECT b.*, 
                pa.flat_no, pa.area, pa.city, pa.state, pa.pincode
         FROM bookings b
         LEFT JOIN pickup_addresses pa ON b.pickup_address_id = pa.id
         WHERE b.user_id = ?
         ORDER BY b.created_at DESC`,
        [userId]
      );

      res.json({
        success: true,
        bookings
      });

    } catch (error) {
      console.error('Get bookings error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  },

  // Get device catalog
  getDeviceCatalog: async (req, res) => {
    try {
      const [devices] = await db.execute(
        'SELECT * FROM device_catalog ORDER BY category, device_name'
      );

      res.json({
        success: true,
        devices,
        pointsPerKg: 30
      });

    } catch (error) {
      console.error('Get device catalog error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  },

  // Calculate points
  calculatePoints: async (req, res) => {
    try {
      const { weight } = req.body;

      if (!weight || isNaN(weight) || weight <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Valid weight is required'
        });
      }

      const points = Math.round(weight * 30);
      const carbonSaved = weight * 2;

      res.json({
        success: true,
        weight: parseFloat(weight),
        points,
        carbonSaved,
        pointsPerKg: 30
      });

    } catch (error) {
      console.error('Calculate points error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
};

module.exports = bookingController;
