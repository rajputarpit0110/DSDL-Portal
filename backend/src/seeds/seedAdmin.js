require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connectDB } = require('../database/mongo/connection');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    await connectDB();
    const name     = process.env.ADMIN_NAME     || 'DSDL Admin';
    const email    = process.env.ADMIN_EMAIL    || 'admin@dsdl.local';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);
    
    await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { name, passwordHash, role: 'admin' },
      { upsert: true, new: true }
    );
    
    console.log('Admin already exists or created — password hash refreshed for:', email);
    console.log('Login with:', email, '/', password);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};
seedAdmin();