require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connectDB } = require('../config/database');

const seedAdmin = async () => {
  try {
    const db = await connectDB();

    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.error('Missing ADMIN credentials in .env file.');
      process.exit(1);
    }

    const existingAdmin = await db.get('SELECT * FROM users WHERE email = ?', [ADMIN_EMAIL.toLowerCase()]);
    if (existingAdmin) {
      console.log('Admin already exists.');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(ADMIN_PASSWORD, salt);

    await db.run(
      `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`,
      [ADMIN_NAME, ADMIN_EMAIL.toLowerCase(), password_hash, 'admin']
    );

    console.log('Admin user seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
