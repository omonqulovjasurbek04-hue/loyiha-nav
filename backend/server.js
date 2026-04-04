const path = require('path');
const fs = require('fs');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// Env yuklash (birinchi!)
dotenv.config();

const app = express();

// ✅ Middleware — barcha routedan OLDIN bo'lishi SHART
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));

// ✅ HEALTHCHECK — MongoDB kutmasdan darhol javob beradi
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Navbat.uz Backend API ishlamoqda' });
});

// MySQL ga ulanish (background — server to'xtamaydi)
const { connectDB } = require('./config/db');
connectDB();

// API Route'larni yuklash
const authRoutes = require('./routes/auth');
const orgRoutes = require('./routes/organizations');
const queueRoutes = require('./routes/queues');

app.use('/api/auth', authRoutes);
app.use('/api/organizations', orgRoutes);
app.use('/api/queues', queueRoutes);

// HTTP va Socket.IO serverni bitta portga ulash
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// io ni route'lardan ishlatish uchun app'ga qo'shamiz
app.set('io', io);

// Socket.IO Eventlar
io.on('connection', (socket) => {
  console.log(`Foydalanuvchi ulandi: ${socket.id}`);

  // Operator o'z tashkilot xonasiga qo'shiladi
  socket.on('join_org', (orgId) => {
    socket.join(`org_${orgId}`);
    console.log(`Socket ${socket.id} org_${orgId} xonasiga kirdi`);
  });

  // Operator navbatni chaqirganda — zal ekraniga signal ketadi
  socket.on('call_next', (data) => {
    io.to(`org_${data.orgId}`).emit('queue_called', data);
    io.emit('queue_called', data); // display board uchun ham
  });

  // Navbat holati yangilanganda — barcha ulangan clientlarga xabar
  socket.on('queue_updated', (data) => {
    if (data.orgId) {
      io.to(`org_${data.orgId}`).emit('queue_status_changed', data);
    } else {
      io.emit('queue_status_changed', data);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Foydalanuvchi uzildi: ${socket.id}`);
  });
});

// Production: frontend build fayllarini serve qilish
const publicPath = path.join(__dirname, 'public');
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(publicPath, 'index.html'));
    }
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ success: false, error: 'Endpoint topilmadi' });
    }
    next();
  });
}

// Global xato ushlash middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Serverda xatolik yuz berdi' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`✅ Server port ${PORT} da ishlamoqda`);
  console.log(`✅ WebSocket (Socket.IO) tayyor`);
});
