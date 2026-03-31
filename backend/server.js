const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// Config path yuklash
dotenv.config();

// MongoDB ga ulanish
const connectDB = require('./config/db');
connectDB();

const app = express();

// Body parser (JSON datani parse qilish)
app.use(express.json());

// CORS ruxsatnomasi (Frontend bilan xavfsiz ulanish)
app.use(cors({
  origin: '*', // Hozircha barcha domenda ulashga ruxsat, Producton'da 'http://localhost:5173' bo'ladi
}));

// API Marshrutlarini yuklash
const authRoutes = require('./routes/auth');
const orgRoutes = require('./routes/organizations');
const queueRoutes = require('./routes/queues');

app.use('/api/auth', authRoutes);
app.use('/api/organizations', orgRoutes);
app.use('/api/queues', queueRoutes);

// HTTP va WebSocket serverni bitta portga ulash
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Asosiy Server-Socket.io Eventlari
io.on('connection', (socket) => {
  console.log(`Bitta foydalanuvchi tizimga ulandi: ${socket.id}`);

  // Operator mijozni chaqirganda
  socket.on('call_next', (data) => {
    // Frontedda zal ekraniga chaqiriq berish
    io.emit('queue_called', data);
  });

  // Navbat malumotlari yangilantirilganda
  socket.on('queue_updated', (data) => {
    io.emit('queue_status_changed', data);
  });

  socket.on('disconnect', () => {
    console.log(`Foydalanuvchi uzildi: ${socket.id}`);
  });
});

// API Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Navbat.uz Backend API barqaror ishlamoqda' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Serverda xatolik yuz berdi' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Backend Server va Websocket port ${PORT} da yugurmoqda`);
});
