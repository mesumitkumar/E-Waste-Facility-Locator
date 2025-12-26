const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes (require authentication)
router.get('/profile', authMiddleware.verifyToken, authController.getProfile);
router.post('/logout', authMiddleware.verifyToken, authController.logout);

module.exports = router;