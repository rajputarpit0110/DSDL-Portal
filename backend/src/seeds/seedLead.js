require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connectDB } = require('../database/sqlite/connection');
const userRepository = require('../repositories/userRepository');
const domainRepository = require('../repositories/domainRepository');

const seedLead = async () => {
  try {
    await connectDB();

    const email = 'lead@dsdl.local';
    const password = 'password123';
    
    const existingLead = await userRepository.findByEmail(email);
    if (existingLead) {
      console.log('Lead user already exists: ' + email);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    await userRepository.create({
      name: 'DSDL Lead',
      email: email,
      passwordHash,
      role: 'lead'
    });

    console.log(`Lead user seeded successfully. Email: ${email}, Password: ${password}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding lead:', error);
    process.exit(1);
  }
};

seedLead();
