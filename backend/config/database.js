const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,        // railway internal host
  user: process.env.MYSQLUSER,        // railway internal user
  password: process.env.MYSQLPASSWORD,// railway internal password
  database: process.env.MYSQLDATABASE,// railway internal database
  port: process.env.MYSQLPORT,        // railway internal port
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (err) {
    console.error('❌ Database connection failed, retrying in 5s:', err.message);
    setTimeout(testConnection, 5000);
  }
}

testConnection();

module.exports = pool;
