const fs = require('fs');
const path = require('path');

const seedsDir = path.join('src', 'seeds');

const write = (dir, name, content) => fs.writeFileSync(path.join(dir, name), content.trim());

// seedAdmin.js
write(seedsDir, 'seedAdmin.js', `
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
`);

// seedLead.js
write(seedsDir, 'seedLead.js', `
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
`);

// seedMember.js
write(seedsDir, 'seedMember.js', `
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
`);

console.log('Successfully wrote seedAdmin, seedLead, and seedMember.');
