const { Sequelize } = require('sequelize');

// MYSQL_URL mavjud bo'lsa uni ishlatamiz, aks holda alohida o'zgaruvchilardan foydalanamiz
const sequelize = process.env.MYSQL_URL
  ? new Sequelize(process.env.MYSQL_URL, {
      dialect: 'mysql',
      logging: false,
      pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
    })
  : new Sequelize(
      process.env.DB_DATABASE,
      process.env.DB_USERNAME,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: process.env.DB_CONNECTION || 'mysql',
        logging: false,
        pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
      }
    );

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('✅ MySQL ulandi');
  } catch (err) {
    console.error('❌ Ulanish xatosi:', err.message);
    setTimeout(connectDB, 10000);
  }
};

module.exports = { sequelize, connectDB };