const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Himoyalangan Marshrutlarni (Protected Routes) tekshirish
exports.protect = async (req, res, next) => {
  let token;

  // Headerda Authorization orqali kelgan tokenni ajratib olish ("Bearer token_123...")
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Agar token yo'q bo'lsa
  if (!token) {
    return res.status(401).json({ success: false, error: 'Ushbu manzilga kirish uchun vakolatingiz yo\'q' });
  }

  try {
    // JWT tokenni maxfiy kalit bilan Decode qilib ruxsatni tekshiramiz
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Foydalanuvchini bazadan topish
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Token muddati tugagan yoki xato: Ruxsat yo\'q' });
  }
};

// Rollarga tekshirish (faqat Admin yoki Operator uchungina ruxsat ko'rsatish)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
         success: false, 
         error: `Sizda ruxsat yo'q! '${req.user.role}' bunday amalni bajarolmaydi.` 
      });
    }
    next();
  };
};
