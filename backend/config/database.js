const mysql = require('mysql2/promise');
require('dotenv').config();

// Log current configuration (for debugging)
console.log('=== MySQL Configuration ===');
console.log('- Host:', process.env.MYSQLHOST);
console.log('- Database:', process.env.MYSQLDATABASE);
console.log('- User:', process.env.MYSQLUSER);
console.log('- Port:', process.env.MYSQLPORT);
console.log('- Password:', process.env.MYSQLPASSWORD ? 'Set' : 'Not set');
console.log('============================');

// Create a promise-based pool with SSL for Railway
const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 30000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
});

// Function to test database connection with retry
async function testConnection(retries = 5) {
  try {
    const connection = await pool.getConnection();

    // Safe test query compatible with all MySQL/MariaDB versions
    const [rows] = await connection.query('SELECT 1 AS test;');
    console.log('✅ Database connected successfully');
    console.log('✅ Test query result:', rows[0]);

    connection.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    if (retries > 0) {
      console.log(`⏳ Retrying in 5 seconds... (${retries} retries left)`);
      setTimeout(() => testConnection(retries - 1), 5000);
    } else {
      console.error('💥 Could not connect to database after multiple attempts.');
      console.error('Full error:', err);
    }
  }
}

// Start connection test on startup
testConnection();

// Export the pool for use in other modules
module.exports = pool;
