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
  <img src="https://img.shields.io/badge/MySQL-Sequelize-blue?logo=mysql" />
  <img src="https://img.shields.io/badge/Socket.IO-4.x-black?logo=socket.io" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-blue?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Docker-Ready-blue?logo=docker" />
</p>

---

## 📋 Mundarija

- [Loyiha haqida](#-loyiha-haqida)
- [Texnologiyalar](#-texnologiyalar)
- [O'rnatish (Installation)](#-ornatish-installation)
- [Loyiha strukturasi](#-loyiha-strukturasi)
- [API Endpointlar](#-api-endpointlar)
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

---

## 🛠 Texnologiyalar

| Qism | Texnologiya |
|------|-------------|
| **Frontend** | React 19, Vite 8, TailwindCSS 4, React Router 7 |
| **Backend** | Node.js, Express 5, Socket.IO 4 |
| **Ma'lumotlar bazasi** | MySQL (Sequelize ORM) |
| **Autentifikatsiya** | JWT (jsonwebtoken), bcrypt |
| **Real-vaqt** | Socket.IO (WebSocket) |
| **HTTP Client** | Axios |
| **Ikonkalar** | Lucide React |
| **Deploy** | Docker, Nginx, Railway |

---

## 📥 O'rnatish (Installation)

### Talab qilinadigan dasturlar
- [Node.js](https://nodejs.org/) v18+
- [MySQL](https://www.mysql.com/) v8+
- [Git](https://git-scm.com/) v2+

### 1. Loyihani yuklab olish
```bash
git clone https://github.com/omonqulovjasurbek04-hue/loyiha-nav.git
cd loyiha-nav
```

### 2. Backend va Frontend paketlarini o'rnatish
```bash
# Backend paketlar
cd backend
npm install

# Frontend paketlar
cd ../frontend
npm install
```

### 3. Backend `.env` fayli
`backend` jildida `.env` qiling:
```env
PORT=5000
MYSQL_URL=mysql://root:parol@localhost:3306/queue_system
JWT_SECRET=maxfiy_kalit_uchun_biron_soz
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

*(Kodni yozgan zahoti tizim **navbatlar, bazalar va formalar** kabi jadvallarni o'zi avtomatik yaratadi. Siz qo'lda SQL kod yozmaysiz!)*

### 4. Ishga tushirish (Local)
Backend'ni yoqish:
```bash
cd backend
npm run dev
```
Frontend'ni yoqish:
```bash
cd frontend
npm run dev
```
Sayt `http://localhost:5173` da ochiladi.

---

## 📁 Loyiha strukturasi (To'liq)

```
loyiha-nav/
├── backend/                    # Backend (Node.js + Express + MySQL)
│   ├── config/
│   │   └── db.js               # MySQL (Sequelize) ulanish konfiguratsiyasi
│   ├── middleware/
│   │   └── auth.js             # JWT autentifikatsiya himoyasi
│   ├── models/
│   │   ├── index.js            # Sequelize munosabatlar (Relationships) ulagichi
│   │   ├── User.js             # Foydalanuvchi modeli (Sequelize UUID bilan)
│   │   ├── Organization.js     # Tashkilot modeli
│   │   └── Queue.js            # Navbat modeli (FK: userId, organizationId)
│   ├── routes/
│   │   ├── auth.js             # Register/Login (Parolni heshlash bcrypt bilan)
│   │   ├── organizations.js    # Tashkilotlar qo'shish va olish
│   │   └── queues.js           # Navbatga ism yozdirish + Soket signalizatsiyasi
│   ├── server.js               # Asosiy Express server va WebSocket ulagichi
│   └── package.json            # Node modullari va skriptlar
│
├── frontend/                   # Frontend (React + Vite)
│   ├── public/                 # Statik rasmlar, logolar
│   ├── src/
│   │   ├── components/         # Takror ishlatiladigan (UI) elementlari
│   │   │   ├── Navbar.jsx      
│   │   │   └── Footer.jsx      
│   │   ├── pages/              # Asosiy sayt sahifalari
│   │   │   ├── Home.jsx        # Asosiy kirish
│   │   │   ├── Login.jsx       # Registratsiya/Login oynasi
│   │   │   ├── BookQueue.jsx   # Taklifnoma yuboruvchi oyna (Navbat olinadigan uzel)
│   │   │   ├── MyQueue.jsx     # Mijozlar tarixlari
│   │   │   ├── admin/Dashboard.jsx # Admin tizimi
│   │   │   ├── operator/Dashboard.jsx # Operator qabulxonasi
│   │   │   └── display/Board.jsx  # Katta ekran uchun displey
│   │   ├── utils/
│   │   │   ├── api.js          # Asosiy Axios zapros bazasi (`/api`)
│   │   │   └── socket.js       # Real-time WebSocket sozlamalari (`socket.io-client`)
│   │   ├── App.jsx             # Router (yo'l-ko'rsatkich) moduli
│   │   └── main.jsx            # React root-ni HTML ga inject qilish
│   ├── index.css               # Vanilla CSS qoidalari
│   └── vite.config.js          # Local Vite portlari
│
├── Dockerfile                  # Production server uchun portlovchi yagona quti 
└── README.md                   # Ushbu o'qiyotgan faylingiz
```

---

## 🔌 API Endpointlar

### 🛡 Autentifikatsiya
| Metod | Endpoint | Tavsif | Himoya |
|-------|----------|--------|--------|
| `POST` | `/api/auth/register` | Yangi mijoz ro'yxatdan o'tishi | ❌ Ochiq |
| `POST` | `/api/auth/login` | Tizimga profilga kirish | ❌ Ochiq |

### 🏢 Tashkilotlar
| Metod | Endpoint | Tavsif | Himoya |
|-------|----------|--------|--------|
| `GET` | `/api/organizations` | Tashkilotlarni o'qish | ❌ |
| `POST` | `/api/organizations` | Yangi filial qo'shish | 🔐 Admin |

### 🎫 Navbatlar
| Metod | Endpoint | Tavsif | Himoya |
|-------|----------|--------|--------|
| `POST` | `/api/queues/book` | Yangi navbat raqamini olish | 🔐 Auth |
| `GET` | `/api/queues/my` | Foydalanuvchining hamma navbatlari | 🔐 Auth |
| `GET` | `/api/queues/org/:orgId` | Bitta tashkilot navbati ro'yxati | 🔐 Op/Admin|
| `PUT` | `/api/queues/:id/status` | Tizimda chaqirish (`called`/`done`) | 🔐 Op/Admin|

### 📡 WebSocket Eventlar (Socket.IO)
- `join_org` - Xonaga (filialga) kirish
- `call_next` - Operatorning chaqirishi (Displey uchun kadr)
- `queue_called` - Mijozga signal bordi
- `queue_updated` - Real-vaqt soniyalik yangilanish 

---
<p align="center">
  Jasurbek Omonqulov — 2026 🚀
</p>
