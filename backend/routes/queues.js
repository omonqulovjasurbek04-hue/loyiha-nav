const express = require('express');
const router = express.Router();
const Queue = require('../models/Queue');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/queues/book
// @desc    Yangi navbat olish darchasi
router.post('/book', protect, async (req, res) => {
  try {
    const { organizationId, service, date, bookedTime } = req.body;
    
    // Bugungi sana bo'yicha filial va servisda nechta qator band bo'lganini bilish (raqam ajratish uchun)
    const count = await Queue.countDocuments({ 
       organizationId, 
       date: new Date(date)
    });
    
    const tokenNumber = count + 1;
    // Prefix qo'shish, masalan 35 -> A-035 (oddiy algoritim)
    const strNum = String(tokenNumber).padStart(3, '0');
    const tokenString = `A-${strNum}`; // 'A' barcha service turlari uchun misol tariqasida

    const calculatedWaitMins = count * 10; // Taxminan har bir klient uchun 10 daqiqa yashirin reja qilinadi o'rtacha

    const newQueue = await Queue.create({
      token: tokenString,
      number: tokenNumber,
      userId: req.user.id,
      organizationId,
      service,
      date: new Date(date),
      bookedTime,
      estimatedWaitMinutes: calculatedWaitMins,
      status: 'waiting'
    });

    res.status(201).json({ success: true, data: newQueue });
  } catch (error) {
    if(error.code === 11000) {
      return res.status(400).json({ success: false, error: 'Gud navbat index allaqachon yaratilgan.'});
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   GET /api/queues/my
// @desc    Shaxsiy olingan barcha navbatlarni ro'yxatini va hozirgilarini olish
router.get('/my', protect, async (req, res) => {
   try {
     const myQueues = await Queue.find({ userId: req.user.id })
            .populate('organizationId', 'name branch')
            .sort({ date: -1, createdAt: -1 });

     res.status(200).json({ success: true, data: myQueues });
   } catch (error) {
     res.status(500).json({ success: false, error: error.message });
   }
});

// @route   PUT /api/queues/:id/status
// @desc    (Operator va Admin uchun) Navbat holatini va raqamni chaqirish amali
router.put('/:id/status', protect, authorize('operator', 'admin'), async (req, res) => {
   try {
      const { status } = req.body; // 'called', 'serving', 'done', 'missed'
      let updateData = { status };

      if(status === 'called') updateData.calledAt = Date.now();
      if(status === 'serving') updateData.servedAt = Date.now();
      if(status === 'done') updateData.completedAt = Date.now();

      const queue = await Queue.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

      if(!queue) return res.status(404).json({ success: false, error: 'Navbat topilmadi!'});

      res.status(200).json({ success: true, data: queue });
   } catch(error) {
      res.status(500).json({ success: false, error: error.message });
   }
});

module.exports = router;
