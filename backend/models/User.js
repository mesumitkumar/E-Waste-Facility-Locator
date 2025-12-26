const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { name, email, password, phone, address, city } = userData;
    
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    const [result] = await db.query(
      'INSERT INTO users (name, email, password_hash, phone, address, city) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, passwordHash, phone, address, city]
    );
    
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.query(
      'SELECT id, name, email, phone, address, city, total_points, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User;