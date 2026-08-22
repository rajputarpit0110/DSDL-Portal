const { getDB } = require('../database/sqlite/connection');
const Achievement = require('../models/Achievement');

const achievementRepository = {
  findAll: async () => {
    const db = getDB();
    const rows = await db.all('SELECT * FROM achievements ORDER BY date DESC, created_at DESC');
    return rows.map(row => new Achievement(row));
  },

  findById: async (id) => {
    const db = getDB();
    const row = await db.get('SELECT * FROM achievements WHERE id = ?', [id]);
    if (!row) return null;
    return new Achievement(row);
  },

  create: async (achievementData) => {
    const db = getDB();
    const { title, description, date, category } = achievementData;
    
    const result = await db.run(
      `INSERT INTO achievements (title, description, date, category) 
       VALUES (?, ?, ?, ?)`,
      [title, description, date, category]
    );
    
    return result.lastID;
  },

  delete: async (id) => {
    const db = getDB();
    await db.run('DELETE FROM achievements WHERE id = ?', [id]);
  }
};

module.exports = achievementRepository;
