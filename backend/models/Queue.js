const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Queue = sequelize.define('Queue', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Navbat raqami majburiy' },
      notEmpty: { msg: 'Navbat raqami majburiy' }
    }
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  organizationId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Organizations',
      key: 'id'
    }
  },
  service: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('waiting', 'called', 'serving', 'done', 'cancelled', 'missed'),
    defaultValue: 'waiting',
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  bookedTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  calledAt: {
    type: DataTypes.DATE,
  },
  servedAt: {
    type: DataTypes.DATE,
  },
  completedAt: {
    type: DataTypes.DATE,
  },
  estimatedWaitMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['organizationId', 'date', 'number']
    },
    {
      fields: ['organizationId', 'status']
    }
  ]
});

module.exports = Queue;
