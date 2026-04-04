const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const router = express.Router();

// Xavfsiz JWT Token Yaratuvchi (Helper Function)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/register
// @desc    Mijoz yoki foydalanuvchini ro'yxatdan o'tkazish
router.post('/register', async (req, res) => {
  try {
    const { name, phone, email, password, role, organizationId } = req.body;

    // Telefon raqam mavjudligini tekshirish
    const phoneExists = await User.findOne({ where: { phone } });
    if (phoneExists) {
       return res.status(400).json({ success: false, error: 'Bu telefon raqam bilan avval ro\'yxatdan o\'tilgan.' });
    }

    // Parolni DB gacha shifrlash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      phone,
      email,
      password: hashedPassword,
      role: role || 'client', // Default 'client'
      organizationId: organizationId || null
    });

    const token = generateToken(user.id);

    res.status(201).json({ success: true, token, user: { id: user.id, name, role: user.role }});

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Tizimga kirish (Login) - Mijoz, User yoki Adminlarga
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Login malumotlari kiritilganligini tekshirish
    if (!phone || !password) {
       return res.status(400).json({ success: false, error: 'Iltimos, telefon va parolni kiriting' });
    }

    // Bazadan qidirish, scope ulanadi chunki user modelda password default exclude qilingan
    const user = await User.scope('withPassword').findOne({ where: { phone } });
    if (!user) {
       return res.status(401).json({ success: false, error: 'Bunday profil topilmadi' });
    }

    // Parolni mosligini check (shifrda)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
       return res.status(401).json({ success: false, error: 'Parol xato' });
    }

    // Success response
    const token = generateToken(user.id);
    res.status(200).json({ success: true, token, user: { id: user.id, name: user.name, role: user.role, organizationId: user.organizationId }});

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
