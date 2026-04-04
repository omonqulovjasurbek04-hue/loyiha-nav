const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI muhit o\'zgaruvchisi topilmadi!');
    return;
  }
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB Ulangan: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB ulanish xatoligi: ${error.message}`);
    console.log('10 soniyadan keyin qayta uriniladi...');
    setTimeout(connectDB, 10000);
  }
};

module.exports = connectDB;
