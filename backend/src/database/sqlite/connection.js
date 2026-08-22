const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');
const { initializeSchema } = require('./schema');

const dbDir = path.join(__dirname, '..', '..', '..', 'database');
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

    await initializeSchema(dbInstance);

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
