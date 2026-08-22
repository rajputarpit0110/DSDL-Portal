require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connectDB } = require('../database/sqlite/connection');
const userRepository = require('../repositories/userRepository');
const domainRepository = require('../repositories/domainRepository');

const seedLead = async () => {
  try {
    await connectDB();

    const email    = 'lead@dsdl.local';
    const password = 'password123';

    const existingLead = await userRepository.findByEmail(email);
    if (existingLead) {
      // Refresh the hash so it always matches the expected password
      const { getDB } = require('../database/sqlite/connection');
      const db = getDB();
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);
      await db.run('UPDATE users SET password_hash = ? WHERE email = ?', [passwordHash, email]);
      console.log(`Lead already exists — password hash refreshed.`);
      console.log(`Login with: ${email} / ${password}`);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    await userRepository.create({
      name: 'DSDL Lead',
      email,
      passwordHash,
      role: 'lead'
    });

    console.log(`Lead user seeded successfully.`);
    console.log(`Login with: ${email} / ${password}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding lead:', error);
    process.exit(1);
  }
};

seedLead();
