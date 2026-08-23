require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connectDB } = require('../database/mongo/connection');
const User = require('../models/User');

const seedLead = async () => {
  try {
    await connectDB();
    const email    = 'lead@dsdl.local';
    const password = 'password123';
    
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);
    
    await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { name: 'DSDL Domain Lead', passwordHash, role: 'lead' },
      { upsert: true, new: true }
    );
    
    console.log('Lead already exists or created — password hash refreshed.');
    console.log('Login with:', email, '/', password);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding lead:', error);
    process.exit(1);
  }
};
seedLead();