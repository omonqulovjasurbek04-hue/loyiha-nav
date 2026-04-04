const { sequelize } = require('../config/db');
const User = require('./User');
const Organization = require('./Organization');
const Queue = require('./Queue');

// Munosabatlar (Relationships) o'rnatish
User.belongsTo(Organization, { foreignKey: 'organizationId', as: 'organization' });
Organization.hasMany(User, { foreignKey: 'organizationId', as: 'users' });

Queue.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Queue, { foreignKey: 'userId', as: 'queues' });

Queue.belongsTo(Organization, { foreignKey: 'organizationId', as: 'organization' });
Organization.hasMany(Queue, { foreignKey: 'organizationId', as: 'queues' });

// Asosiy exportlar
module.exports = {
  sequelize,
  User,
  Organization,
  Queue
};
