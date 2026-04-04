const { Sequelize } = require('sequelize');

let sequelize;

if (process.env.MYSQL_URL) {
  sequelize = new Sequelize(process.env.MYSQL_URL, {
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // Graceful fallback to prevent app crash if variable is missing
  sequelize = new Sequelize('mysql://root:pass@localhost:3306/test', {
    dialect: 'mysql',
    logging: false
  });
}

const connectDB = async () => {
  try {
    if (!process.env.MYSQL_URL) {
      console.error("❌ XATOLIK: MYSQL_URL muhit o'zgaruvchisi topilmadi!");
      console.error("Iltimos Railway dagi Web xizmatingiz Variables qismiga MYSQL_URL ni va uning qiymatini kiritishni unutmang!");
      return;
    }
    
    await sequelize.authenticate();
    console.log(`✅ MySQL Ulangan: ${sequelize.config.host}`);
    
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
