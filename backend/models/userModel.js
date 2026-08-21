const { getDB } = require('../config/database');

const userModel = {
  async findByEmail(email) {
    const db = getDB();
    return db.get('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
  },

  async findById(id) {
    const db = getDB();
    return db.get('SELECT * FROM users WHERE id = ?', [id]);
  },

  async create(userData) {
    const db = getDB();
    const { name, email, password_hash, enrollment_number, branch, year, role } = userData;
    
    const result = await db.run(
      `INSERT INTO users (name, email, password_hash, enrollment_number, branch, year, role) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email.toLowerCase(), password_hash, enrollment_number, branch, year, role || 'member']
    );
    
    return this.findById(result.lastID);
  }
};

module.exports = userModel;
