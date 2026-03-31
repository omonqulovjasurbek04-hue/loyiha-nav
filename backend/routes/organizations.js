const express = require('express');
const router = express.Router();
const Organization = require('../models/Organization');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/organizations
// @desc    Barcha tashkilotlarni olish (Ochiq)
router.get('/', async (req, res) => {
  try {
    const orgs = await Organization.find();
    res.status(200).json({ success: true, count: orgs.length, data: orgs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   POST /api/organizations
// @desc    Yangi tashkilot qo'shish (Faqat Admin uchun)
router.post('/', protect, authorize('admin'), async (req, res) => {
   try {
     const org = await Organization.create(req.body);
     res.status(201).json({ success: true, data: org });
   } catch (error) {
     res.status(400).json({ success: false, error: error.message });
   }
});

// @route   GET /api/organizations/:id
// @desc    Bitta tashkilot ma'lumotlarini olish (Ochiq)
router.get('/:id', async (req, res) => {
   try {
     const org = await Organization.findById(req.params.id);
     if (!org) {
        return res.status(404).json({ success: false, error: 'Xatolik: Bunday tashkilot topilmadi' });
     }
     res.status(200).json({ success: true, data: org });
   } catch (error) {
     res.status(500).json({ success: false, error: error.message });
   }
});

module.exports = router;
