require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connectDB } = require('../database/sqlite/connection');
const userRepository = require('../repositories/userRepository');

const seedAdmin = async () => {
  try {
    await connectDB();

    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.error('Missing ADMIN credentials in .env file.');
      process.exit(1);
    }

    const existingAdmin = await userRepository.findByEmail(ADMIN_EMAIL);
    if (existingAdmin) {
      console.log('Admin already exists.');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, salt);

    await userRepository.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      passwordHash,
      role: 'admin'
    });

    console.log('Admin user seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
