const path = require('path');
const fs = require('fs');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.CLIENT_URL, 'http://localhost:5173'] // Prod-da xavfsizlik va local test
    : ['http://localhost:5173', 'http://127.0.0.1:5173', process.env.CLIENT_URL], // Lokal kompyuterda hammaga ruxsat
  credentials: true,
}));

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Navbat.uz Backend API is running' });
});

const { connectDB } = require('./config/db');
connectDB();

const authRoutes = require('./routes/auth');
const orgRoutes = require('./routes/organizations');
const queueRoutes = require('./routes/queues');

app.use('/api/auth', authRoutes);
app.use('/api/organizations', orgRoutes);
app.use('/api/queues', queueRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.set('io', io);

io.on('connection', (socket) => {
  socket.on('join_org', (orgId) => {
    socket.join(`org_${orgId}`);
  });

  socket.on('call_next', (data) => {
    io.to(`org_${data.orgId}`).emit('queue_called', data);
    io.emit('queue_called', data);
  });

  socket.on('queue_updated', (data) => {
    if (data.orgId) {
      io.to(`org_${data.orgId}`).emit('queue_status_changed', data);
    } else {
      io.emit('queue_status_changed', data);
    }
  });

  socket.on('disconnect', () => {
  });
});

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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Server error' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
