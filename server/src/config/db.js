const mongoose = require('mongoose');

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI;
  const fallbackUri = 'mongodb://127.0.0.1:27017/secureauth_db';

  try {
    const conn = await mongoose.connect(primaryUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`Primary MongoDB Connection (${primaryUri}) failed: ${error.message}`);
    if (primaryUri !== fallbackUri) {
      console.log(`Attempting fallback connection to local MongoDB: ${fallbackUri}...`);
      try {
        const conn = await mongoose.connect(fallbackUri);
        console.log(`MongoDB Connected via Fallback: ${conn.connection.host}`);
        return;
      } catch (fallbackError) {
        console.error(`Fallback MongoDB Connection Error: ${fallbackError.message}`);
      }
    }
    process.exit(1);
  }
};

module.exports = connectDB;
