const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ismni kiritish majburiy'],
  },
  phone: {
    type: String,
    required: [true, 'Telefon raqamini kiritish majburiy'],
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    required: [true, 'Parolni kiritish majburiy'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['client', 'operator', 'admin'],
    default: 'client',
  },
  organizationId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Organization',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);
