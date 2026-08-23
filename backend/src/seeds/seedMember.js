require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connectDB } = require('../database/mongo/connection');
const User = require('../models/User');

const seedMember = async () => {
  try {
    await connectDB();
    const email    = 'member@dsdl.com';
    const password = 'member123';
    
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);
    
    await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { name: 'DSDL Member', passwordHash, role: 'member' },
      { upsert: true, new: true }
    );
    
    console.log('Member already exists or created — password hash refreshed.');
    console.log('Login with:', email, '/', password);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding member:', error);
    process.exit(1);
  }
};
seedMember();