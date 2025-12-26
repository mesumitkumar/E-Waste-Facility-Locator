const mysql = require('mysql2/promise');  // Note: using mysql2/promise for promise support
require('dotenv').config();

// Create a promise-based pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ewaste_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection using promises
pool.getConnection()
  .then((connection) => {
    console.log('✅ Database connected successfully');
    connection.release();
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
    console.log('💡 Tips:');
    console.log('   - Check if MySQL is running');
    console.log('   - Check .env file credentials');
    console.log('   - Run: mysql -u root -p -e "CREATE DATABASE ewaste_db;"');
  });

// Export the promise-based pool
module.exports = pool;