const mongoose = require('mongoose');

const QueueSchema = new mongoose.Schema({
  token: {
    type: String,
    required: [true, 'Navbat raqami majburiy'],
  },
  number: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  organizationId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Organization',
    required: true,
  },
  service: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['waiting', 'called', 'serving', 'done', 'cancelled', 'missed'],
    default: 'waiting',
  },
  date: {
    type: Date,
    required: true,
  },
  bookedTime: {
    type: String, // Misol uchun: '10:30'
    required: true,
  },
  calledAt: {
    type: Date,
  },
  servedAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
  estimatedWaitMinutes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Kuniga har bir filial va servis uchun raqamlash qulay bo'lishi lozim (index bilan tezlik)
QueueSchema.index({ organizationId: 1, date: 1, number: 1 }, { unique: true });

module.exports = mongoose.model('Queue', QueueSchema);
