require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connectDB } = require('../database/sqlite/connection');
const userRepository = require('../repositories/userRepository');

const seedAdmin = async () => {
  try {
    await connectDB();

    const name     = process.env.ADMIN_NAME     || 'DSDL Admin';
    const email    = process.env.ADMIN_EMAIL    || 'admin@dsdl.local';
    // Always default to 'admin123' so it matches the quick-login button on Login.jsx
    const password = process.env.ADMIN_PASSWORD || 'admin123';

    const existingAdmin = await userRepository.findByEmail(email);
    if (existingAdmin) {
      // Update the hash so it always matches the current ADMIN_PASSWORD env value
      const { getDB } = require('../database/sqlite/connection');
      const db = getDB();
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);
      await db.run('UPDATE users SET password_hash = ? WHERE email = ?', [passwordHash, email]);
      console.log(`Admin already exists — password hash refreshed for: ${email}`);
      console.log(`Login with: ${email} / ${password}`);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    await userRepository.create({
      name,
      email,
      passwordHash,
      role: 'admin'
    });

    console.log(`Admin user seeded successfully.`);
    console.log(`Login with: ${email} / ${password}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
