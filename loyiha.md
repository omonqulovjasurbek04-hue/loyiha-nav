# 📘 Navbat.uz — Loyiha Hujjatlari

> Bu hujjat loyihani GitHub'dan klonlab, o'rnatib, ishga tushirish va uning ustida ishlash uchun to'liq qo'llanma hisoblanadi.

---

## 📥 Loyihani klonlash va o'rnatish

### 1-qadam: Repozitoriyani klonlash

```bash
git clone https://github.com/SIZNING_USERNAME/navbat-uz.git
cd navbat-uz
```

### 2-qadam: Backend o'rnatish

```bash
cd backend
npm install
```

### 3-qadam: `.env` faylini sozlash

`backend/.env.example` faylidan nusxa oling va sozlang:

```bash
cp .env.example .env
```

`.env` ichidagi qiymatlarni to'g'rilang:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/queue_system
JWT_SECRET=o_zingizning_maxfiy_kalitingizni_yozing
NODE_ENV=development
```

### 4-qadam: Frontend o'rnatish

```bash
cd ../frontend
npm install
```

---

## 🚀 Loyihani ishga tushirish

### Kerakli dasturlar
- **Node.js** v18 yoki undan yuqori
- **MongoDB** v6 yoki undan yuqori (mahalliy yoki Atlas)
- **Git** v2+

### Ishga tushirish tartibi

#### 1. MongoDB serverini ishga tushiring
```bash
mongod
```

#### 2. Backend serverni ishga tushiring (Terminal 1)
```bash
cd backend
npm start
```
> Server `http://localhost:5000` portda ishlaydi

#### 3. Frontend dev serverni ishga tushiring (Terminal 2)
```bash
cd frontend
npm run dev
```
> Frontend `http://localhost:5173` portda ishlaydi

#### 4. Brauzerda tekshirish
- Frontend: http://localhost:5173
- Backend Health Check: http://localhost:5000/api/health

### Docker bilan ishga tushirish (muqobil)

```bash
cd frontend
docker-compose up --build
```

Natija: http://localhost (port 80)

---

## 🏗️ Loyiha Arxitekturasi va To'liq Tahlil

### Umumiy ko'rinish

Navbat.uz — bu **full-stack monorepo** loyiha bo'lib, 2 ta asosiy qismdan iborat:

```
navbat-uz/
├── backend/    → Node.js + Express + MongoDB (REST API + WebSocket)
├── frontend/   → React 19 + Vite 8 + TailwindCSS 4 (SPA)
```

### Arxitektura diagrammasi

```
┌─────────────────────┐     ┌─────────────────────────┐
│   Frontend (React)  │────▶│   Backend (Express.js)  │
│   Port: 5173 (dev)  │ API │   Port: 5000            │
│   Port: 80 (prod)   │────▶│                         │
│                     │     │   ┌──────────────────┐  │
│  ┌───── SPA ──────┐ │ WS  │   │  Socket.IO       │  │
│  │ React Router   │ │◄───▶│   │  (real-vaqt)     │  │
│  │ Axios (HTTP)   │ │     │   └──────────────────┘  │
│  │ Socket.IO CLI  │ │     │                         │
│  └────────────────┘ │     │   ┌──────────────────┐  │
└─────────────────────┘     │   │  MongoDB         │  │
                            │   │  (Mongoose ORM)  │  │
                            │   └──────────────────┘  │
                            └─────────────────────────┘
```

---

## 📂 Backend Tahlili

### server.js — Asosiy server

Backend'ning kirish nuqtasi. Quyidagi vazifalarni bajaradi:
- Express ilovasini yaratadi
- MongoDB'ga ulanadi (`config/db.js` orqali)
- CORS va JSON parser o'rnatadi
- 3 ta API route guruhini yuklaydi
- HTTP server ustiga **Socket.IO** ni ulaydi
- WebSocket eventlarni tinglaydi (`call_next`, `queue_updated`)

### Ma'lumotlar bazasi modellari

#### User (Foydalanuvchi)
```
- name          → Ism (majburiy)
- phone         → Telefon raqam (unikal, majburiy)
- email         → Email (ixtiyoriy)
- password      → Parol (shifrlangan, min 6 belgi)
- role          → Rol: 'client' | 'operator' | 'admin'
- organizationId → Tashkilotga bog'lanish (faqat operator/admin)
- createdAt     → Yaratilgan sana
```

#### Organization (Tashkilot)
```
- name          → Tashkilot nomi (majburiy)
- category      → Kategoriya: bank, hospital, government, hokimiyat, education, tax
- branch        → Filial nomi (majburiy)
- address       → Manzil (majburiy)
- phone         → Telefon
- workHours     → Ish vaqti (default: 09:00-18:00)
- services      → Xizmatlar ro'yxati [Array]
- isOpen        → Ochiq/yopiq holat
- createdAt     → Yaratilgan sana
```

#### Queue (Navbat)
```
- token              → Navbat raqami, masalan: "A-047"
- number             → Raqamli tartib (1, 2, 3...)
- userId             → Foydalanuvchi ID (ref: User)
- organizationId     → Tashkilot ID (ref: Organization)
- service            → Tanlangan xizmat turi
- status             → Holat: waiting | called | serving | done | cancelled | missed
- date               → Navbat sanasi
- bookedTime         → Band qilingan vaqt (masalan: "10:30")
- calledAt           → Chaqirilgan vaqt
- servedAt           → Xizmat boshlangan vaqt
- completedAt        → Tugallangan vaqt
- estimatedWaitMinutes → Taxminiy kutish vaqti (daqiqada)
- createdAt          → Yaratilgan sana
```

**Index:** `{organizationId, date, number}` — unikal, tezkor qidiruv uchun.

### Middleware

#### auth.js — JWT Himoya
- `protect` — Bearer token'ni tekshiradi, foydalanuvchini `req.user`'ga joylashtiradi
- `authorize(...roles)` — Faqat belgilangan rollarga ruxsat beradi

### API Routes

#### /api/auth
| Endpoint | Metod | Tavsif |
|----------|-------|--------|
| `/register` | POST | Yangi foydalanuvchi yaratish. Parol bcrypt bilan shifrlanadi. |
| `/login` | POST | Telefon + parol bilan kirish. JWT token qaytariladi. |

#### /api/organizations
| Endpoint | Metod | Himoya | Tavsif |
|----------|-------|--------|--------|
| `/` | GET | Ochiq | Barcha tashkilotlarni olish |
| `/:id` | GET | Ochiq | Bitta tashkilot ma'lumoti |
| `/` | POST | Admin | Yangi tashkilot qo'shish |

#### /api/queues
| Endpoint | Metod | Himoya | Tavsif |
|----------|-------|--------|--------|
| `/book` | POST | Auth | Navbat olish (token raqamini avtomatik yaratadi) |
| `/my` | GET | Auth | O'z navbatlarini ko'rish |
| `/:id/status` | PUT | Operator/Admin | Navbat statusini yangilash |

### WebSocket (Socket.IO) Eventlar

| Event | Yo'nalish | Tavsif |
|-------|-----------|--------|
| `connection` | — | Yangi foydalanuvchi ulanganda |
| `call_next` | Client→Server | Operator keyingi mijozni chaqiradi |
| `queue_called` | Server→Client | Zal ekraniga chaqiriq signali |
| `queue_updated` | Client→Server | Navbat ma'lumotlari yangilandi |
| `queue_status_changed` | Server→Client | Yangi status barcha klientlarga |
| `disconnect` | — | Foydalanuvchi uzilganda |

---

## 📂 Frontend Tahlili

### Texnologiya steki
- **React 19** — UI framework
- **Vite 8** — Build tool (tez dev server)
- **TailwindCSS 4** — Utility-first CSS framework
- **React Router 7** — Client-side routing
- **Axios** — HTTP so'rovlar
- **Socket.IO Client** — Real-vaqt ulanish
- **Lucide React** — SVG ikonkalar kutubxonasi

### Dizayn tizimi (index.css)

Loyihada **glassmorphism** dizayn tizimi ishlatilgan:

| Klass | Vazifasi |
|-------|---------|
| `.glass` | Shaffof fon + blur effekt (asosiy kartalar) |
| `.glass-light` | Yengil shaffof fon |
| `.btn-primary` | Gradient tugma (indigo → purple) |
| `.btn-secondary` | Ikkilamchi tugma (border bilan) |
| `.card-hover` | Kartalarning hover animatsiyasi |
| `.glow` | Indigo rangdagi yorug'lik effekti |
| `.text-gradient` | Gradient matn (indigo → violet) |
| `.animate-float` | Suzib yuruvchi animatsiya |
| `.animate-pulse-slow` | Sekin pulsatsiya |
| `.animate-slide-up` | Pastdan yuqoriga surilish |
| `.animate-fade-in` | Paydo bo'lish animatsiyasi |

**Rang pallitasi:**
- Primary: `#6366f1` (Indigo)
- Fon: `#0f172a` → `#1e1b4b` (gradient)
- Matn: `#e2e8f0` (Slate-200)
- Accent: `#f59e0b` (Amber)

### Sahifalar tahlili

#### 🏠 Home.jsx — Bosh sahifa
Loyihaning landing page'i. Bo'limlar:
1. **Hero Section** — asosiy sarlavha, CTA tugmalari, mini-statistika
2. **Queue Card Preview** — navbat kartasi demo ko'rinishi
3. **Categories** — tashkilot kategoriyalari (bank, shifoxona va h.k.)
4. **How it Works** — 3 bosqichli qo'llanma
5. **Features** — tizim afzalliklari
6. **CTA** — harakatga chaqiruv bloki

#### 🏢 Organizations.jsx — Tashkilotlar
- Tashkilotlar ro'yxati
- Kategoriya bo'yicha filtratsiya
- Qidiruv funksiyasi

#### 🎫 BookQueue.jsx — Navbat olish
- Tashkilot tanlash
- Xizmat turini tanlash
- Sana va vaqtni band qilish
- Navbat tasdiqlash

#### 📋 MyQueue.jsx — Mening navbatlarim
- Foydalanuvchining barcha navbatlari
- Har bir navbat holati (kutish, chaqirilgan, tugatilgan)
- Bekor qilish imkoniyati

#### 🔐 Login.jsx — Kirish / Ro'yxatdan o'tish
- Ikki rejimli forma (Login / Register)
- Telefon raqam + parol bilan kirish
- Parolni ko'rsatish/yashirish
- Form validatsiya

#### 👨‍💼 operator/Dashboard.jsx — Operator paneli
- Joriy xizmat ko'rsatilayotgan navbat (katta karta)
- Navbatlar ro'yxati (o'ng panel)
- Amallar: **Chaqirish**, **Tugatish**, **O'tkazib yuborish**
- Real-vaqt soati
- Statistikalar: kutayotganlar, bajarilganlar, kelmaganlar

#### 📺 display/Board.jsx — Zal ekrani
- TV/monitor uchun full-screen rejim
- Hozirgi chaqirilgan raqam (katta ko'rinishda)
- Ish o'rni raqami
- Navbatdagilar ro'yxati
- Real-vaqt soat va sana
- Navbar va Footer **yashirilgan** (maxsus layout)

#### 🛡️ admin/Dashboard.jsx — Admin paneli
- Sidebar navigatsiya (Dashboard, Tashkilotlar, Xizmatlar, Mijozlar)
- Statistika kartalari (tashkilotlar, mijozlar, navbatlar, daromad)
- Haftalik navbat grafigi (CSS bar chart)
- Top tashkilotlar reytingi
- Tashkilotlar jadvali (CRUD)
- Navbar va Footer **yashirilgan** (maxsus layout)

### Routing tizimi (App.jsx)

```jsx
/                  → Home          (Navbar + Footer)
/tashkilotlar      → Organizations (Navbar + Footer)
/navbat-olish      → BookQueue     (Navbar + Footer)
/mening-navbatim   → MyQueue       (Navbar + Footer)
/kirish            → Login         (Navbar + Footer)
/operator          → Dashboard     (Navbar + Footer)
/display           → Board         (Layout YASHIRIN)
/admin             → Dashboard     (Layout YASHIRIN)
```

### Utils (yordamchi fayllar)

#### api.js
- Axios instance yaratadi (`baseURL: http://localhost:5000/api`)
- Request interceptor orqali har bir so'rovga JWT tokenni avtomatik qo'shadi
- `VITE_API_URL` muhit o'zgaruvchisi orqali moslashtiriladi

#### socket.js
- Socket.IO clientini yaratadi
- Avtomatik ulanish va qayta ulanish
- `VITE_SOCKET_URL` muhit o'zgaruvchisi orqali moslashtiriladi

---

## 🐳 Docker konfiguratsiyasi

### Backend Dockerfile
- `node:18-alpine` bazaviy image
- `npm install` → `npm start`
- Port: 5000

### Frontend Dockerfile (multi-stage)
1. **Build stage:** `node:18-alpine` da `npm run build`
2. **Production stage:** `nginx:alpine` da build natijasini serve qilish
- Port: 80

### docker-compose.yml
3 ta servis:
- `mongodb` — rasmiy mongo image, volume bilan
- `backend` — Node.js server, MongoDB ga bog'langan
- `frontend` — Nginx, backend ga bog'langan

### nginx.conf
- `/` → React SPA fayllariga (react-router uchun `try_files`)
- `/api/` → Backend serverga proxy
- `/socket.io/` → WebSocket serverga proxy (upgrade bilan)

---

## 💡 Loyihani rivojlantirish rejalari

### Hozirgi holat
- [x] Backend API (auth, organizations, queues)
- [x] JWT autentifikatsiya
- [x] WebSocket real-vaqt infratuzilma
- [x] Frontend sahifalar (Home, Organizations, BookQueue, MyQueue, Login)
- [x] Operator paneli
- [x] Admin paneli
- [x] Zal ekrani (Display Board)
- [x] Docker konfiguratsiya
- [x] Glassmorphism dizayn tizimi

### Keyingi qadamlar (TODO)
- [ ] Login/Register'ni backend bilan to'liq integratsiya qilish
- [ ] Tashkilotlar sahifasini API'dan dinamik yuklash
- [ ] Navbat olish form'ini backend'ga ulash
- [ ] Operator paneliga real WebSocket integratsiyasi
- [ ] Display Board'ga real-vaqt WebSocket ulanish
- [ ] Admin paneldan tashkilot CRUD operatsiyalari
- [ ] Parolni tiklash funksiyasi
- [ ] SMS tasdiqlash tizimi
- [ ] Bildirishnomalar (push notification)
- [ ] Ko'p tilli qo'llab-quvvatlash (uz/ru/en)
- [ ] Mobil ilova (React Native)

---

## 🔧 Foydali buyruqlar

```bash
# Backend
cd backend && npm start             # Serverni ishga tushirish
cd backend && node server.js        # To'g'ridan-to'g'ri ishga tushirish

# Frontend
cd frontend && npm run dev          # Dev server (HMR bilan)
cd frontend && npm run build        # Production build
cd frontend && npm run preview      # Build natijasini ko'rish
cd frontend && npm run lint         # Kod sifatini tekshirish

# Docker
docker-compose up --build           # Barchasini ishga tushirish
docker-compose down                 # Barchasini to'xtatish
docker-compose logs -f backend      # Backend loglarini kuzatish
```

---

## ❓ Tez-tez so'raladigan savollar

**S: MongoDB ishga tushmayapti?**
J: MongoDB o'rnatilganligini va `mongod` buyrug'i bilan ishga tushganligini tekshiring.

**S: Frontend backend'ga ulana olmayapti?**
J: Backend `localhost:5000` da ishlayotganini va CORS sozlamalari to'g'ri ekanligini tekshiring.

**S: Docker'da backend MongoDB'ga ulana olmayapti?**
J: `docker-compose.yml`'da `MONGODB_URI` `mongodb://mongodb:27017/queue_system` bo'lishi kerak (localhost emas).

---

<p align="center">
  <strong>Navbat.uz</strong> — Vaqtingizni tejang, onlayn navbat oling! 🚀
</p>
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
