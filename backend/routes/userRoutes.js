const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// All user routes require authentication
router.use(authMiddleware.verifyToken);

// User endpoints
router.get('/dashboard', userController.getDashboard);
router.get('/stats', userController.getStats);

module.exports = router;