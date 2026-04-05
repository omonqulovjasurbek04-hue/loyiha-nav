const express = require('express');
const router = express.Router();
const Queue = require('../models/Queue');

// GET /api/stats/org/:orgId
// Bugungi barcha navbatlarni holati bo'ycha hisoblab qaytaradi.
router.get('/org/:orgId', async (req, res) => {
  try {
    const { orgId } = req.params;
    const date = req.query.date || new Date().toISOString().split('T')[0];

    const stats = {
      waiting: 0,
      served: 0,
      missed: 0,
    };

    const queues = await Queue.findAll({
      where: {
        organizationId: orgId,
        date: date
      }
    });

    queues.forEach(q => {
      if (q.status === 'waiting') {
        stats.waiting += 1;
      } else if (q.status === 'done') {
        stats.served += 1;
      } else if (q.status === 'missed') {
        stats.missed += 1;
      }
    });

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error('Statistika Error:', error);
    res.status(500).json({ success: false, error: 'Server xatosi, statistika yuklanmadi' });
  }
});

module.exports = router;
