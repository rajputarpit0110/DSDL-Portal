require('dotenv').config();

console.log('MONGO_URI:', process.env.MONGO_URI ? 'FOUND' : 'NOT FOUND');

const app = require('./app');
const { connectDB } = require('./database/mongo/connection');

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();