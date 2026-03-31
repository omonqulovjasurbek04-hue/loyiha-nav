import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Socket server bilan aloqa ulanmoqda...
const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
});

socket.on('connect', () => {
    console.log('Real vaqt WebSocket aloqasi ulandi! ID:', socket.id);
});

socket.on('disconnect', () => {
    console.log('Real vaqt ulanishi uzildi!');
});

export default socket;
