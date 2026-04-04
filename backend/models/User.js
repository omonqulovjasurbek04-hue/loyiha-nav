const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Ismni kiritish majburiy' },
      notEmpty: { msg: 'Ismni kiritish majburiy' }
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Ushbu telefon raqami allaqachon band.'
    },
    validate: {
      notNull: { msg: 'Telefon raqamini kiritish majburiy' },
      notEmpty: { msg: 'Telefon raqamini kiritish majburiy' }
    }
  },
  email: {
    type: DataTypes.STRING,
    unique: {
      msg: 'Ushbu xat manzili (email) band.'
    },
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Parolni kiritish majburiy' },
      notEmpty: { msg: 'Parolni kiritish majburiy' },
      len: {
        args: [6, 255],
        msg: 'Parol kamida 6 belgidan iborat bo\'lishi kerak'
      }
    }
  },
  role: {
    type: DataTypes.ENUM('client', 'operator', 'admin'),
    defaultValue: 'client',
  },
  organizationId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Organizations', 
      key: 'id'
    }
  }
}, {
  timestamps: true,
  defaultScope: {
    attributes: { exclude: ['password'] },
  },
  scopes: {
    withPassword: {
      attributes: { },
    }
  }
});

module.exports = User;
