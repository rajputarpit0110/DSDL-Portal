require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connectDB } = require('../database/sqlite/connection');
const userRepository = require('../repositories/userRepository');

const seedMember = async () => {
  try {
    await connectDB();

    const email    = 'member@dsdl.com';
    const password = 'member123';

    const existingMember = await userRepository.findByEmail(email);
    if (existingMember) {
      const { getDB } = require('../database/sqlite/connection');
      const db = getDB();
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);
      await db.run('UPDATE users SET password_hash = ? WHERE email = ?', [passwordHash, email]);
      console.log('Member already exists — password hash refreshed.');
      console.log('Login with: ' + email + ' / ' + password);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    await userRepository.create({
      name: 'DSDL Member',
      email,
      passwordHash,
      role: 'member'
    });

    console.log('Member user seeded successfully.');
    console.log('Login with: ' + email + ' / ' + password);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding member:', error);
    process.exit(1);
  }
};

seedMember();
