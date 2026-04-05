const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.MYSQL_URL, {
  dialect: 'mysql',
  logging: false,
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
});

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