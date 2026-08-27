const mongoose = require('mongoose');
const dns = require('dns');

// Fix for Windows / ISP DNS querySrv ECONNREFUSED when resolving mongodb+srv://
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1', '1.0.0.1']);
} catch (e) {
  console.warn('Could not set custom DNS servers:', e.message);
}

const connectDB = async (retries = 3, delay = 2000) => {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    console.error('❌ MONGO_URI is not defined in environment variables.');
    process.exit(1);
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 20000,
      });

      console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`⚠️ MongoDB connection attempt ${attempt}/${retries} failed: ${error.message}`);
      if (attempt === retries) {
        console.error('❌ Could not connect to MongoDB after multiple attempts.');
        process.exit(1);
      }
      await new Promise(res => setTimeout(res, delay));
    }
  }
};

const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

module.exports = { connectDB, disconnectDB };
