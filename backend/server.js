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

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
db.getConnection()
  .then((connection) => {
    console.log('✅ Database test passed');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database test failed:', err.message);
  });

/* =========================
   API BASE ROUTE (NEW)
   ========================= */
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

/* =========================
   ROUTES
   ========================= */
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

/* =========================
   HEALTH CHECK
   ========================= */
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    message: 'E-Waste Backend is running',
    timestamp: new Date().toISOString()
  });
});

/* =========================
   TEST DATABASE
   ========================= */
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS solution');
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

/* =========================
   ERROR HANDLING
   ========================= */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server error'
  });
});

/* =========================
   404 HANDLER
   ========================= */
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

/* =========================
   START SERVER
   ========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 API Base: http://localhost:${PORT}/api`);
  console.log(`📝 Health:   http://localhost:${PORT}/api/health`);
  console.log(`📝 Test DB:  http://localhost:${PORT}/api/test-db`);
});
