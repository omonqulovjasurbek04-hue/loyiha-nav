const express = require('express');
const router = express.Router();
const { Queue, Organization, User } = require('../models');
const { protect, authorize } = require('../middleware/auth');
const { Op } = require('sequelize');

// @route   POST /api/queues/book
// @desc    Yangi navbat olish
router.post('/book', protect, async (req, res) => {
  try {
    const { organizationId, service, date, bookedTime } = req.body;

    const count = await Queue.count({
      where: {
        organizationId,
        date: date
      }
    });

    const tokenNumber = count + 1;
    const strNum = String(tokenNumber).padStart(3, '0');
    const tokenString = `A-${strNum}`;
    const calculatedWaitMins = count * 10;

    const newQueue = await Queue.create({
      token: tokenString,
      number: tokenNumber,
      userId: req.user.id,
      organizationId,
      service,
      date: date,
      bookedTime,
      estimatedWaitMinutes: calculatedWaitMins,
      status: 'waiting'
    });

    // Real-time: yangi navbat qo'shilgani haqida xabar
    const io = req.app.get('io');
    if (io) {
      io.to(`org_${organizationId}`).emit('queue_status_changed', {
        orgId: organizationId,
        action: 'new_booking',
        queue: newQueue
      });
    }

    res.status(201).json({ success: true, data: newQueue });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, error: 'Bu navbat raqami allaqachon mavjud.' });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   GET /api/queues/my
// @desc    Foydalanuvchining o'z navbatlari
router.get('/my', protect, async (req, res) => {
  try {
    const myQueues = await Queue.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Organization,
        as: 'organization',
        attributes: ['name', 'branch', 'address']
      }],
      order: [
        ['date', 'DESC'],
        ['createdAt', 'DESC']
      ]
    });

    res.status(200).json({ success: true, data: myQueues });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   GET /api/queues/org/:orgId
// @desc    Tashkilot navbatlarini olish (Operator va Admin uchun)
// @query   ?date=YYYY-MM-DD (ixtiyoriy, default: bugun)
router.get('/org/:orgId', protect, authorize('operator', 'admin'), async (req, res) => {
  try {
    const { orgId } = req.params;
    const dateStr = req.query.date || new Date().toISOString().split('T')[0];

    const queues = await Queue.findAll({
      where: {
        organizationId: orgId,
        date: dateStr
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['name', 'phone']
      }],
      order: [
        ['number', 'ASC']
      ]
    });

    res.status(200).json({ success: true, count: queues.length, data: queues });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/queues/:id/status
// @desc    Navbat holatini yangilash (Operator va Admin)
router.put('/:id/status', protect, authorize('operator', 'admin'), async (req, res) => {
  try {
    const { status } = req.body;
    let updateData = { status };

    if (status === 'called') updateData.calledAt = new Date();
    if (status === 'serving') updateData.servedAt = new Date();
    if (status === 'done') updateData.completedAt = new Date();

    const queue = await Queue.findByPk(req.params.id);
    if (!queue) return res.status(404).json({ success: false, error: 'Navbat topilmadi!' });

    await queue.update(updateData);
    
    // Yana foydalanuvchini ham qo'shib yuklaymiz
    await queue.reload({
      include: [{
        model: User,
        as: 'user',
        attributes: ['name', 'phone']
      }]
    });

    // Real-time: status o'zgargani haqida
    const io = req.app.get('io');
    if (io) {
      io.to(`org_${queue.organizationId}`).emit('queue_status_changed', {
        orgId: queue.organizationId,
        action: 'status_update',
        queue
      });
      // Display board uchun (called va serving holatlarda)
      if (status === 'called' || status === 'serving') {
        io.emit('queue_called', {
          orgId: queue.organizationId,
          token: queue.token,
          service: queue.service,
          status
        });
      }
    }

    res.status(200).json({ success: true, data: queue });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
