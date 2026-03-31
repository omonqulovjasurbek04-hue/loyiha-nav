<p align="center">
  <img src="frontend/public/logo.svg" alt="Navbat.uz Logo" width="80" />
</p>

<h1 align="center">Navbat.uz — Online Navbat Tizimi</h1>

<p align="center">
  O'zbekiston tashkilotlari uchun zamonaviy onlayn navbat boshqaruv platformasi.<br/>
  Bank, shifoxona, davlat xizmatlari — barcha joyga onlayn navbat oling!
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" />
  <img src="https://img.shields.io/badge/Node.js-Express-green?logo=node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-darkgreen?logo=mongodb" />
  <img src="https://img.shields.io/badge/Socket.IO-4.x-black?logo=socket.io" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-blue?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Docker-Ready-blue?logo=docker" />
</p>

---

## 📋 Mundarija

- [Loyiha haqida](#-loyiha-haqida)
- [Texnologiyalar](#-texnologiyalar)
- [O'rnatish (Installation)](#-ornatish-installation)
- [Ishga tushirish (Run)](#-ishga-tushirish-run)
- [Docker bilan ishga tushirish](#-docker-bilan-ishga-tushirish)
- [Loyiha strukturasi](#-loyiha-strukturasi)
- [API Endpointlar](#-api-endpointlar)
- [Sahifalar va Routinglar](#-sahifalar-va-routinglar)
- [Muhit o'zgaruvchilari](#-muhit-ozgaruvchilari)
- [Litsenziya](#-litsenziya)

---

## 🎯 Loyiha haqida

**Navbat.uz** — bu tashkilotlarda (bank, shifoxona, davlat idoralari) onlayn navbat olish va boshqarish uchun yaratilgan to'liq stack veb-platforma.

### Asosiy imkoniyatlar:
- 🏢 **Tashkilotlar ro'yxati** — bank, shifoxona, hokimiyat va boshqa kategoriyalar
- 🎫 **Onlayn navbat olish** — internet orqali navbat band qilish
- 📊 **Real-vaqt kuzatish** — WebSocket orqali jonli holat
- 👨‍💼 **Operator paneli** — navbatlarni boshqarish, chaqirish, tugatish
- 📺 **Zal ekrani (Display Board)** — TV/monitorlarda navbat raqamini ko'rsatish
- 🛡️ **Admin paneli** — tashkilotlar va foydalanuvchilarni boshqarish
- 🔐 **JWT autentifikatsiya** — xavfsiz kirish tizimi
- 📱 **Responsive dizayn** — mobil, planshet va kompyuterga moslashgan

---

## 🛠 Texnologiyalar

| Qism | Texnologiya |
|------|-------------|
| **Frontend** | React 19, Vite 8, TailwindCSS 4, React Router 7 |
| **Backend** | Node.js, Express 5, Socket.IO 4 |
| **Ma'lumotlar bazasi** | MongoDB (Mongoose 9) |
| **Autentifikatsiya** | JWT (jsonwebtoken), bcrypt |
| **Real-vaqt** | Socket.IO (WebSocket) |
| **HTTP Client** | Axios |
| **Ikonkalar** | Lucide React |
| **Deploy** | Docker, Nginx |

---

## 📥 O'rnatish (Installation)

### Talab qilinadigan dasturlar

| Dastur | Minimal versiya |
|--------|----------------|
| [Node.js](https://nodejs.org/) | v18+ |
| [MongoDB](https://www.mongodb.com/try/download/community) | v6+ |
| [Git](https://git-scm.com/) | v2+ |

### 1. Loyihani klonlash (clone)

```bash
git clone https://github.com/SIZNING_USERNAME/navbat-uz.git
cd navbat-uz
```

### 2. Backend o'rnatish

```bash
cd backend
npm install
```

### 3. Muhit sozlamalari (.env)

`backend/.env.example` faylidan nusxa oling:

```bash
cp .env.example .env
```

`.env` faylini tahrirlang:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/queue_system
JWT_SECRET=o_zingizning_maxfiy_kalitingizni_yozing
NODE_ENV=development
```

### 4. Frontend o'rnatish

```bash
cd ../frontend
npm install
```

---

## 🚀 Ishga tushirish (Run)

> ⚠️ MongoDB serverini avval ishga tushiring!

### MongoDB ni ishga tushirish

```bash
mongod
```

### Backend serverni ishga tushirish

```bash
cd backend
npm start
```

Server `http://localhost:5000` da ishlaydi.

### Frontend dev serverni ishga tushirish

Yangi terminal oching:

```bash
cd frontend
npm run dev
```

Frontend `http://localhost:5173` da ishlaydi.

### Tekshirish

Brauzerda oching:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api/health

---

## 🐳 Docker bilan ishga tushirish

Bir buyruqda loyihani to'liq ishga tushirish:

```bash
cd frontend
docker-compose up --build
```

Bu buyruq 3 ta konteynerni ishga tushiradi:
- `navbat_db` — MongoDB
- `navbat_backend` — Node.js API server (port 5000)
- `navbat_frontend` — React + Nginx (port 80)

Brauzerda: http://localhost

---

## 📁 Loyiha strukturasi

```
navbat-uz/
├── backend/                    # Backend (Node.js + Express)
│   ├── config/
│   │   └── db.js               # MongoDB ulanish konfiguratsiyasi
│   ├── middleware/
│   │   └── auth.js             # JWT autentifikatsiya middleware
│   ├── models/
│   │   ├── User.js             # Foydalanuvchi modeli
│   │   ├── Organization.js     # Tashkilot modeli
│   │   └── Queue.js            # Navbat modeli
│   ├── routes/
│   │   ├── auth.js             # Register/Login API endpointlari
│   │   ├── organizations.js    # Tashkilotlar CRUD endpointlari
│   │   └── queues.js           # Navbat boshqaruv API endpointlari
│   ├── server.js               # Asosiy server fayli (Express + Socket.IO)
│   ├── .env.example            # Muhit o'zgaruvchilari namunasi
│   ├── Dockerfile              # Backend Docker image
│   └── package.json
│
├── frontend/                   # Frontend (React + Vite)
│   ├── public/
│   │   ├── logo.svg            # Sayt logotipi
│   │   ├── favicon.svg         # Brauzer ikonkasi
│   │   └── icons.svg           # SVG sprite ikonkalari
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Navigatsiya paneli
│   │   │   └── Footer.jsx      # Sayt pastki qismi
│   │   ├── pages/
│   │   │   ├── Home.jsx        # Bosh sahifa
│   │   │   ├── Organizations.jsx # Tashkilotlar sahifasi
│   │   │   ├── BookQueue.jsx   # Navbat olish sahifasi
│   │   │   ├── MyQueue.jsx     # Mening navbatlarim sahifasi
│   │   │   ├── Login.jsx       # Kirish / Registratsiya sahifasi
│   │   │   ├── admin/
│   │   │   │   └── Dashboard.jsx # Admin boshqaruv paneli
│   │   │   ├── operator/
│   │   │   │   └── Dashboard.jsx # Operator ish paneli
│   │   │   └── display/
│   │   │       └── Board.jsx   # Zal ekrani (TV display)
│   │   ├── utils/
│   │   │   ├── api.js          # Axios API konfiguratsiyasi
│   │   │   └── socket.js       # Socket.IO client konfiguratsiyasi
│   │   ├── App.jsx             # Asosiy App komponenti (Routing)
│   │   ├── main.jsx            # React entry point
│   │   ├── index.css           # Global stiller (TailwindCSS + custom)
│   │   └── App.css             # App-specific stiller
│   ├── docker-compose.yml      # Docker Compose konfiguratsiyasi
│   ├── Dockerfile              # Frontend Docker image (Nginx)
│   ├── nginx.conf              # Nginx reverse proxy konfiguratsiyasi
│   ├── vite.config.js          # Vite build konfiguratsiyasi
│   └── package.json
│
├── .gitignore                  # Git ignore qoidalari
└── README.md                   # Loyiha hujjati (shu fayl)
```

---

## 🔌 API Endpointlar

### Autentifikatsiya

| Metod | Endpoint | Tavsif | Himoya |
|-------|----------|--------|--------|
| `POST` | `/api/auth/register` | Yangi foydalanuvchi yaratish | ❌ |
| `POST` | `/api/auth/login` | Tizimga kirish | ❌ |

### Tashkilotlar

| Metod | Endpoint | Tavsif | Himoya |
|-------|----------|--------|--------|
| `GET` | `/api/organizations` | Barcha tashkilotlarni olish | ❌ |
| `GET` | `/api/organizations/:id` | Bitta tashkilot ma'lumoti | ❌ |
| `POST` | `/api/organizations` | Yangi tashkilot qo'shish | 🔐 Admin |

### Navbatlar

| Metod | Endpoint | Tavsif | Himoya |
|-------|----------|--------|--------|
| `POST` | `/api/queues/book` | Navbat olish (band qilish) | 🔐 Auth |
| `GET` | `/api/queues/my` | O'z navbatlarini ko'rish | 🔐 Auth |
| `PUT` | `/api/queues/:id/status` | Navbat statusini o'zgartirish | 🔐 Operator/Admin |

### Tizim holati

| Metod | Endpoint | Tavsif |
|-------|----------|--------|
| `GET` | `/api/health` | Server sog'lig'ini tekshirish |

### WebSocket Eventlar (Socket.IO)

| Event | Yo'nalish | Tavsif |
|-------|-----------|--------|
| `call_next` | Client → Server | Operator keyingi mijozni chaqiradi |
| `queue_called` | Server → Client | Zal ekraniga chaqiriq signal |
| `queue_updated` | Client → Server | Navbat ma'lumotlari yangilandi |
| `queue_status_changed` | Server → Client | Barcha klientlarga yangi status |

---

## 📄 Sahifalar va Routinglar

| Yo'l | Sahifa | Tavsif |
|------|--------|--------|
| `/` | Bosh sahifa | Landing page, tashkilot kategoriyalari |
| `/tashkilotlar` | Tashkilotlar | Tashkilotlar ro'yxati va filtratsiya |
| `/navbat-olish` | Navbat olish | Xizmat va vaqt tanlash formasi |
| `/mening-navbatim` | Mening navbatim | Foydalanuvchining navbatlari |
| `/kirish` | Kirish | Login / Registratsiya |
| `/operator` | Operator paneli | Navbatlarni boshqarish |
| `/display` | Zal ekrani | TV monitorlar uchun display |
| `/admin` | Admin panel | Tizimni boshqarish |

---

## 🔑 Muhit o'zgaruvchilari

### Backend (`backend/.env`)

| O'zgaruvchi | Tavsif | Misol |
|-------------|--------|-------|
| `PORT` | Server port raqami | `5000` |
| `MONGODB_URI` | MongoDB ulanish manzili | `mongodb://127.0.0.1:27017/queue_system` |
| `JWT_SECRET` | JWT token shifrlovchi kalit | `maxfiy_kalit_123` |
| `NODE_ENV` | Ishlash muhiti | `development` / `production` |

### Frontend (`.env` yoki Vite muhiti)

| O'zgaruvchi | Tavsif | Misol |
|-------------|--------|-------|
| `VITE_API_URL` | Backend API manzili | `http://localhost:5000/api` |
| `VITE_SOCKET_URL` | WebSocket server manzili | `http://localhost:5000` |

---

## 🤝 Hissa qo'shish (Contributing)

1. Loyihani fork qiling
2. Yangi branch yarating: `git checkout -b feature/yangi-funksiya`
3. O'zgarishlarni commit qiling: `git commit -m "Yangi funksiya qo'shildi"`
4. Push qiling: `git push origin feature/yangi-funksiya`
5. Pull Request yarating

---

## 📝 Litsenziya

Bu loyiha [MIT](LICENSE) litsenziyasi ostida tarqatiladi.

---

<p align="center">
  O'zbekiston uchun ❤️ bilan ishlab chiqilgan 🇺🇿
</p>
