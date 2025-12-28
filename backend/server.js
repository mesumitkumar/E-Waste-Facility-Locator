// =========================
// ENVIRONMENT VARIABLES LOG
// =========================
console.log('=== ENVIRONMENT VARIABLES ===');
console.log('MYSQLHOST:', process.env.MYSQLHOST);
console.log('MYSQLDATABASE:', process.env.MYSQLDATABASE);
console.log('MYSQLUSER:', process.env.MYSQLUSER);
console.log('MYSQLPORT:', process.env.MYSQLPORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('==============================');

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database
const db = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');

// Initialize app
const app = express();

// =========================
// MIDDLEWARE
// =========================
app.use(cors());
app.use(express.json());

// =========================
// ROOT ROUTE
// =========================
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 E-Waste Backend is running',
    apiBase: '/api',
    endpoints: {
      health: '/api/health',
      testDB: '/api/test-db',
      mysqlTest: '/api/mysql-test',
      auth: '/api/auth',
      users: '/api/users',
      bookings: '/api/bookings'
    }
  });
});

// =========================
// API BASE ROUTE
// =========================
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'E-Waste API is running 🚀',
    availableEndpoints: {
      health: '/api/health',
      testDB: '/api/test-db',
      auth: '/api/auth',
      users: '/api/users',
      bookings: '/api/bookings'
    }
  });
});

// =========================
// ROUTES
// =========================
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

// =========================
// HEALTH CHECK
// =========================
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    message: 'E-Waste Backend is running',
    timestamp: new Date().toISOString()
  });
});

// =========================
// TEST DATABASE
// =========================
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 AS test;'); // Railway-safe test query
    res.json({ 
      success: true, 
      message: 'Database is working!',
      data: rows[0]
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Database error',
      error: err.message
    });
  }
});

// =========================
// MYSQL TEST
// =========================
app.get('/api/mysql-test', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT CURRENT_TIMESTAMP AS server_time, DATABASE() AS db_name, VERSION() AS mysql_version;'
    );
    
    res.json({
      success: true,
      message: 'MySQL is connected and working!',
      data: rows[0],
      connection: {
        host: process.env.MYSQLHOST,
        database: process.env.MYSQLDATABASE,
        user: process.env.MYSQLUSER
      }
    });
  } catch (error) {
    console.error('MySQL test error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      errorCode: error.code,
      hint: 'Add ssl: { rejectUnauthorized: false } to database.js connection'
    });
  }
});

// =========================
// ERROR HANDLING
// =========================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server error'
  });
});

// =========================
// 404 HANDLER
// =========================
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// =========================
// START SERVER
// =========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 API Base: http://localhost:${PORT}/api`);
  console.log(`📝 Health:   http://localhost:${PORT}/api/health`);
  console.log(`📝 Test DB:  http://localhost:${PORT}/api/test-db`);
});
