const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

// All booking routes require authentication
router.use(authMiddleware.verifyToken);

// Booking endpoints
router.post('/', bookingController.createBooking);
router.get('/', bookingController.getUserBookings);
router.post('/calculate-points', bookingController.calculatePoints);

module.exports = router;