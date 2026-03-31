const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tashkilot nomi majburiy'],
  },
  category: {
    type: String,
    enum: ['bank', 'hospital', 'government', 'hokimiyat', 'education', 'tax'],
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  workHours: {
    type: String,
    default: '09:00 - 18:00',
  },
  services: [{
    type: String
  }],
  isOpen: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Organization', OrganizationSchema);
