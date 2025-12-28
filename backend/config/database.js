const mysql = require('mysql2/promise');  // Note: using mysql2/promise for promise support
require('dotenv').config();

// Log current configuration
console.log('MySQL Configuration:');
console.log('- Host:', process.env.MYSQLHOST);
console.log('- Database:', process.env.MYSQLDATABASE);
console.log('- User:', process.env.MYSQLUSER);
console.log('- Port:', process.env.MYSQLPORT);
console.log('- Password:', process.env.MYSQLPASSWORD ? 'Set' : 'Not set');

// Create a promise-based pool WITH SSL FOR RAILWAY
const pool = mysql.createPool({
  host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
  user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'ewaste_db',
  port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
  
  // ✅ CRITICAL: Add this SSL configuration for Railway
  ssl: {
    rejectUnauthorized: false
  },
  
  // ✅ Add these for better connection handling
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 30000,  // 30 seconds timeout
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
});

// Test connection using promises
pool.getConnection()
  .then((connection) => {
    console.log('✅ Database connected successfully');
    
    // Test a simple query
    return connection.query('SELECT NOW() as current_time, DATABASE() as db_name')
      .then(([rows]) => {
        console.log('✅ Query test successful:', rows[0]);
        connection.release();
      });
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
    console.error('Error code:', err.code);
    console.error('Full error:', err);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Check if MYSQLPASSWORD is set correctly in Railway variables');
    console.log('2. Check if MySQL service is running (green status)');
    console.log('3. Try connecting from Railway terminal:');
    console.log('   railway run mysql -h $MYSQLHOST -u $MYSQLUSER -p');
    console.log('4. Verify database exists:');
    console.log('   railway run mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD -e "SHOW DATABASES;"');
  });

// Export the promise-based pool
module.exports = pool;