import axios from 'axios';

// Backend serverga o'tkazish indeksi (development)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Avtomat holda Tokenlarni yuborish uchun interceptor (Auth)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // JWT token ulanadi
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
