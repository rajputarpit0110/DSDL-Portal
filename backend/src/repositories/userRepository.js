const { getDB } = require('../database/sqlite/connection');
const User = require('../models/User');

class UserRepository {
  async findByEmail(email) {
    const db = getDB();
    const row = await db.get('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    return row ? new User(row) : null;
  }

  async findById(id) {
    const db = getDB();
    const row = await db.get('SELECT * FROM users WHERE id = ?', [id]);
    return row ? new User(row) : null;
  }

  async create(userData) {
    const db = getDB();
    const { name, email, passwordHash, enrollmentNumber, branch, year, role } = userData;
    
    const result = await db.run(
      `INSERT INTO users (name, email, password_hash, enrollment_number, branch, year, role) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email.toLowerCase(), passwordHash, enrollmentNumber, branch, year, role || 'member']
    );
    
    return this.findById(result.lastID);
  }
}

module.exports = new UserRepository();
