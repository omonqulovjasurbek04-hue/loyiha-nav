const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.MYSQL_URL, {
  dialect: 'mysql',
  logging: false, // Konsolga so'rovlar chiqmasligi uchun
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const connectDB = async () => {
  try {
    if (!process.env.MYSQL_URL) {
      console.error("MYSQL_URL muhit o'zgaruvchisi topilmadi!");
      return;
    }
    
    await sequelize.authenticate();
    console.log(`✅ MySQL Ulangan: ${sequelize.config.host}`);
    
    // Jadvallarni avtomatik tuzish (bu fayllarni chaqiramizki, u registratsiya bo'lsin)
    require('../models');
    await sequelize.sync({ alter: true });
    console.log(`✅ MySQL jadvallar yangilandi va tayyor.`);
  } catch (error) {
    console.error(`❌ MySQL ulanish xatoligi: ${error.message}`);
    console.log('10 soniyadan keyin qayta uriniladi...');
    setTimeout(connectDB, 10000);
  }
};

module.exports = { sequelize, connectDB };
