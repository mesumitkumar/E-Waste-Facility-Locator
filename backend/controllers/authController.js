const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const authController = {
  // Register user
  register: async (req, res) => {
    try {
      const { name, email, password, phone = '', address = '', city = '' } = req.body;

      // Check if user exists
      const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email'
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Create user
      const [result] = await db.execute(
        'INSERT INTO users (name, email, password_hash, phone, city, total_points) VALUES (?, ?, ?, ?, ?, ?)',
        [name, email, passwordHash, phone, city, 100]
      );

      const userId = result.insertId;

      // Generate JWT token
      const token = jwt.sign(
        { id: userId, email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '30d' }
      );

      // Get user data without password
      const [userRows] = await db.execute(
        'SELECT id, name, email, phone, city, total_points, created_at FROM users WHERE id = ?',
        [userId]
      );

      res.status(201).json({
        success: true,
        message: 'Registration successful!',
        token,
        user: userRows[0]
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during registration'
      });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user
      const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const user = users[0];

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '30d' }
      );

      // Remove password from response
      delete user.password_hash;

      res.json({
        success: true,
        message: 'Login successful!',
        token,
        user
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during login'
      });
    }
  },

  // Get user profile
  getProfile: async (req, res) => {
    try {
      const userId = req.user.id;

      const [users] = await db.execute(
        'SELECT id, name, email, phone, city, total_points, created_at FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        user: users[0]
      });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  },

  // Logout
  logout: (req, res) => {
    res.json({
      success: true,
      message: 'Logout successful'
    });
  }
};

module.exports = authController;