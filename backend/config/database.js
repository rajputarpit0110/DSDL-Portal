const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

// Ensure database directory exists
const dbDir = path.join(__dirname, '..', 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = process.env.DATABASE_PATH || path.join(dbDir, 'portal.sqlite');

let dbInstance = null;

const connectDB = async () => {
  try {
    if (dbInstance) return dbInstance;

    dbInstance = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    console.log(`SQLite Database Connected at ${dbPath}`);

    // Initialize tables
    await dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        enrollment_number TEXT,
        branch TEXT,
        year INTEGER,
        role TEXT NOT NULL DEFAULT 'member',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Database tables initialized.');

    return dbInstance;
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const getDB = () => {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return dbInstance;
};

module.exports = { connectDB, getDB };
