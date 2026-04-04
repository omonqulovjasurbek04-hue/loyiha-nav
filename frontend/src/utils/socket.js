import { io } from 'socket.io-client';

const explicit = import.meta.env.VITE_SOCKET_URL;
const SOCKET_URL =
  explicit !== undefined && explicit !== ''
    ? explicit
    : import.meta.env.DEV
      ? 'http://localhost:5000'
      : window.location.origin;

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
