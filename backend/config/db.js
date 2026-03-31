const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Ulangan: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Xatolik: MongoDB'ga ulanish muvaffaqiyatsiz - ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
