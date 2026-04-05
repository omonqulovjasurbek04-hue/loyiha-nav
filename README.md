# 📘 E-Navbat UZ — Elektron Navbat Tizimi

> O'zbekiston davlat va nodavlat idoralari uchun elektron navbat olish tizimi.

---

## 🚀 Tezkor Boshlash

```bash
# 1. Dependencies o'rnatish (birinchi marta)
npm install

# 2. .env faylni sozlash
# .env faylni ochib, o'z ma'lumotlaringizni kiriting

# 3. Database ishga tushirish (Docker kerak)
npm run db:up

# 4. Loyihani ishga tushirish
npm run dev
```

---

## 📁 Loyiha Strukturasi

```
loyiha-nav/
├── package.json              ← Barcha dependencies
├── tsconfig.json             ← Server TypeScript config
├── nest-cli.json             ← NestJS config
├── .env                      ← Yagona environment fayl
├── docker-compose.yml        ← PostgreSQL + Redis + App
├── Dockerfile                ← Production build
├── entrypoint.sh             ← Container entrypoint
│
├── server/                   ← Backend (NestJS)
│   └── src/
│       ├── main.ts           ← Kirish nuqtasi
│       ├── app.module.ts     ← Root modul
│       ├── auth/             ← OTP + JWT autentifikatsiya
│       ├── users/            ← Foydalanuvchilar
│       ├── organizations/    ← Idoralar va xizmatlar
│       ├── queues/           ← Navbat va chiptalar
│       ├── operators/        ← Operator panel
│       ├── notifications/    ← WebSocket Gateway
│       └── common/           ← Guards, Filters, Interceptors
│
└── client/                   ← Frontend (Next.js)
    ├── app/                  ← Pages (/, /login)
    ├── src/
    │   ├── lib/              ← API, Socket, Auth utilities
    │   ├── hooks/            ← useQueue (WebSocket hook)
    │   └── types/            ← TypeScript interfaces
    └── next.config.ts        ← Next.js config
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Tavsif |
|--------|----------|--------|
| POST | `/api/auth/send-otp` | OTP yuborish |
| POST | `/api/auth/verify-otp` | OTP tasdiqlash → JWT |
| POST | `/api/auth/refresh` | Token yangilash |
| POST | `/api/auth/logout` | Chiqish |

### Users
| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/users/me` | O'z profilim |
| PATCH | `/api/users/me` | Profilni yangilash |
| GET | `/api/users` | Barcha foydalanuvchilar (admin) |

### Organizations
| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/organizations` | Idoralar ro'yxati |
| GET | `/api/organizations/:id` | Idora tafsiloti |
| GET | `/api/organizations/:id/services` | Xizmatlar ro'yxati |

### Tickets (Navbat)
| Method | Endpoint | Tavsif |
|--------|----------|--------|
| POST | `/api/tickets` | Navbat olish |
| GET | `/api/tickets/my` | Mening navbatlarim |
| DELETE | `/api/tickets/:id` | Navbatdan chiqish |
| PATCH | `/api/tickets/:id/call` | Navbatni chaqirish (operator) |
| PATCH | `/api/tickets/:id/complete` | Xizmat tugallandi |

### Operators
| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/operators/window` | Operator paneli |
| POST | `/api/operators/next` | Keyingi navbatni chaqirish |
| PATCH | `/api/operators/complete` | Xizmat yakunlandi |
| PATCH | `/api/operators/skip` | O'tkazib yuborish |
| PATCH | `/api/operators/status` | Holat: ACTIVE / BREAK / OFFLINE |

---

## 🔌 WebSocket Events

### Client → Server
| Event | Data | Tavsif |
|-------|------|--------|
| `join_queue` | `{ ticket_id }` | Navbatga ulanish |
| `leave_queue` | `{ ticket_id }` | Navbatdan chiqish |

### Server → Client
| Event | Data | Tavsif |
|-------|------|--------|
| `queue_update` | `{ position, waiting_count, estimated_wait }` | Navbat yangilandi |
| `ticket_called` | `{ ticket_number, window_number }` | Navbatingiz chaqirildi |
| `ticket_skipped` | `{ message }` | Navbat o'tkazib yuborildi |

---

## ⚙️ Buyruqlar

| Buyruq | Tavsif |
|--------|--------|
| `npm run dev` | Backend + Frontend bir vaqtda |
| `npm run build` | Ikkalasini build qilish |
| `npm run start` | Production mode |
| `npm run db:up` | PostgreSQL + Redis ishga tushirish |
| `npm run db:down` | Database to'xtatish |
| `npm run db:logs` | Database loglarini ko'rish |

---

## 🔒 Xavfsizlik

- **Rate Limiting:** 100 so'rov/daqiqa, OTP 3 ta/soat
- **JWT:** Access 15 daqiqa, Refresh 30 kun
- **Redis Blacklist:** Logout qilingan tokenlar bekor qilinadi
- **Helmet.js:** XSS va clickjacking himoyasi
- **CORS:** Faqat ruxsat etilgan domenlar
- **Validation:** `class-validator` orqali barcha inputlar tekshiriladi

---

## 🛠️ Environment Variables

`.env` faylda:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/enavbat

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key-min-32-characters
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=http://localhost:3000
```

---

## 🚢 Deploy

### Railway
1. GitHub ga push qiling
2. Railway da PostgreSQL + Redis + App qo'shing
3. Environment variables kiriting

Batafsil: `DEPLOY.md` faylini ko'ring.

### Docker
```bash
docker compose up -d --build
```

---

## 📦 Texnologiyalar

| Qism | Texnologiya |
|------|-------------|
| Frontend | Next.js 16 + React 19 + TailwindCSS v4 |
| Backend | NestJS 11 + TypeScript |
| Database | PostgreSQL 15 |
| Cache | Redis 7 |
| Real-time | WebSocket (Socket.IO 4) |
| Auth | JWT + OTP SMS |
