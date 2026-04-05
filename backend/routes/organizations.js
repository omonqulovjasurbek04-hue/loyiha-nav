const express = require('express');
const router = express.Router();
const { Organization } = require('../models');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/organizations
// @desc    Barcha tashkilotlarni olish (Ochiq)
router.get('/', async (req, res) => {
  try {
    const orgs = await Organization.findAll();
    res.status(200).json({ success: true, count: orgs.length, data: orgs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   GET /api/organizations/add-form
// @desc    Backend orqali tashkilot qo'shish uchun ochiq HTML forma
router.get('/add-form', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="uz">
    <head>
      <meta charset="UTF-8">
      <title>Backend - Tashkilot Qo'shish</title>
      <style>
        body { font-family: sans-serif; background: #0f172a; color: white; display: flex; justify-content: center; padding: 50px; }
        form { background: #1e293b; padding: 30px; border-radius: 10px; width: 400px; display: flex; flex-direction: column; gap: 15px; }
        input, select { padding: 10px; border-radius: 5px; border: 1px solid #334155; background: #0f172a; color: white; }
        button { padding: 10px; background: #4f46e5; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }
        button:hover { background: #4338ca; }
      </style>
    </head>
    <body>
      <form action="/api/organizations/add-from-backend" method="POST">
        <h2>🏢 Yangi Tashkilot (Backend)</h2>
        <input type="text" name="name" placeholder="Tashkilot nomi (masalan Xalq Bank)" required />
        <select name="category" required>
          <option value="bank">Bank</option>
          <option value="hospital">Shifoxona</option>
          <option value="government">Davlat idorasi</option>
          <option value="hokimiyat">Hokimiyat</option>
          <option value="education">Ta'lim</option>
        </select>
        <input type="text" name="branch" placeholder="Filial (masalan Yunusobod)" required />
        <input type="text" name="address" placeholder="Manzil" required />
        <input type="text" name="phone" placeholder="Telefon raqam" />
        <input type="text" name="services" placeholder="Xizmatlar (Kredit, Karta)" />
        <button type="submit">Saqlash</button>
      </form>
    </body>
    </html>
  `);
});

// @route   POST /api/organizations/add-from-backend
// @desc    HTML formadan kelgan datani ushlash
router.post('/add-from-backend', express.urlencoded({ extended: true }), async (req, res) => {
  try {
    const { name, category, branch, address, phone, services } = req.body;
    let srvArray = [];
    if (services) {
       srvArray = services.split(',').map(s => s.trim()).filter(Boolean);
    }
    await Organization.create({ name, category, branch, address, phone, services: srvArray });
    res.send('<h2 style="color:green; text-align:center; font-family:sans-serif; margin-top:50px;">✅ Tashkilot muvaffaqiyatli qo\'shildi! <br><a href="/api/organizations/add-form">Yana qo\'shish</a></h2>');
  } catch (err) {
    res.send('<h2 style="color:red; text-align:center;">❌ Xatolik: ' + err.message + '</h2>');
  }
});

// @route   POST /api/organizations
// @desc    Yangi tashkilot qo'shish (Hozircha React(Frontend) ham qiynalmasligi uchun Ochiq qildim)
router.post('/', async (req, res) => {
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
     const org = await Organization.findByPk(req.params.id);
     if (!org) {
        return res.status(404).json({ success: false, error: 'Xatolik: Bunday tashkilot topilmadi' });
     }
     res.status(200).json({ success: true, data: org });
   } catch (error) {
     res.status(500).json({ success: false, error: error.message });
   }
});

module.exports = router;
