const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Organization = sequelize.define('Organization', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Tashkilot nomi majburiy' },
      notEmpty: { msg: 'Tashkilot nomi majburiy' }
    }
  },
  category: {
    type: DataTypes.ENUM('bank', 'hospital', 'government', 'hokimiyat', 'education', 'tax'),
    allowNull: false,
  },
  branch: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
  },
  workHours: {
    type: DataTypes.STRING,
    defaultValue: '09:00 - 18:00',
  },
  services: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  isOpen: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
}, {
  timestamps: true,
});

module.exports = Organization;
