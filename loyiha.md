# 📘 E-Navbat UZ — Loyiha Hujjatlari

> Bu hujjat loyihani o'rnatish, ishga tushirish va uning ustida ishlash uchun to'liq qo'llanma hisoblanadi. Tizim eng zamonaviy va **Enterprise** arxitektura standartlariga moslashtirilgan.

---

## 🎯 Tizim Va Arxitektura Tanlovlari

O'zbekiston davlat va nodavlat idoralari uchun universal elektron navbat olish tizimi sifatida quyidagi kuchli vositalar tanlangan:

- **Frontend — Next.js (React):** Navbat holatini real vaqtda ko'rsatish (foydalanuvchi telefonida "Siz 5-navbatdasiz" deb avtomatik yangilanib turishi uchun), mobil qurilmalarga maksimal darajada qulay moslashish va O'zbekistonda mavjud serverlar bilan mukammal integratsiyalashish kafolatlangan.
- **Backend — Node.js + NestJS:** Eng to'g'ri tanlov. Sababi: Tizim WebSocket orqali real-time (jonli) tarzda ishlaydi, bir vaqtning o'zida minglab foydalanuvchini barqaror boshqara oladi, va navbat mantig'ini mustahkam ushlab qoluvchi toza arxitektura (Clean Architecture) modullariga ega.
- **PostgreSQL:** Barcha asosiy biznes ma'lumotlarni (foydalanuvchilar, tugatilgan navbatlar, tarix qoldig'i, davlat idoralari ro'yxati) o'ta xavfsiz va ishonchli holatda saqlab beruvchi aloqador Relational Database.
- **Redis (In-Memory Data Store):** Hozirgi (aynan bugungi kutish zalidagi) navbat holatini milisoniyalarda tez-tez yangilab turish uchun RAM (operativ xotira) da saqlaydi hamda asinxron ko'rsatkichni juda tezlashtiradi.

---

## 📥 Loyihani klonlash va o'rnatish

### 1-qadam: Repozitoriyani klonlash

```bash
git clone https://github.com/SIZNING_USERNAME/loyiha-nav.git
cd loyiha-nav
```

### 2-qadam: Baza (DB) Infratuzilmasini Tiklash
Loyihaning ildiz (root) papkasidagi `docker-compose.yml` orqali **PostgreSQL** va **Redis** serverlarini avtomatik holda ishga tushiring:

```bash
docker-compose up -d
```
Bu holda bazangiz loyihaga ishlashga tayyor bo'ladi. Hozirgi standartlarga mofib PostgreSQL 5432-portda, Redis 6379-portda xizmat qiladi.

---

### 3-qadam: Backend Tizimini O'stirish (NestJS)
```bash
cd server
npm install
```

`server/.env` faylida o'zingizning DB va Redis ma'lumotlarini to'g'rilang:
```env
PORT=4000
NODE_ENV=development

# POSTGRES DATABASE
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=enavbat

# REDIS
REDIS_HOST=localhost
REDIS_PORT=6379

# AUTH (JWT)
JWT_SECRET=super_secret_jwt_enavbat_2026
JWT_EXPIRATION=15m
```

### 4-qadam: Frontend Tizimini O'stirish (Next.js 14)
```bash
cd ../client
npm install
```
`client/.env.local` ichini sozlang:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

---

## 🚀 Loyihani ishga tushirish

1. **Backend API ni ishga tushirish (Terminal 1)**
```bash
cd server
npm run start:dev
```
> Server `http://localhost:4000` portda ishlaydi

2. **Frontend UI ni ishga tushirish (Terminal 2)**
```bash
cd client
npm run dev
```
> Next.js App `http://localhost:3000` yoki `3001` da ishlaydi

---

## 🏗️ Arxitektura Diagrammasi

```text
┌─────────────────────────┐          ┌───────────────────────────────────┐
│ Frontend (Next.js 14+)  │          │   Backend (NestJS)                │
│                         │          │   - AuthModule                    │
│ - App Router            │          │   - UsersModule                   │
│ - Server Components     │◄───API───┤   - OrganizationsModule           │
│ - TailwindCSS           │          │   - QueuesModule                  │
│                         │◄───WS────┤   - TicketsModule                 │
└─────────────────────────┘          │   - WebsocketGateway              │
                                     └───────────────┬───────────────────┘
                                                     │ 
                                           ┌─────────┴────────┐
                                           ▼                  ▼
                                ┌─────────────────┐   ┌────────────────┐
                                │    Redis        │   │ PostgreSQL     │
                                │ (Live Cache)    │   │ (Tarix va DB)  │
                                └─────────────────┘   └────────────────┘
```

## 🔒 Xavfsizlik Va Qoidalar
1. **Clean Architecture:** NestJS jadvallari: `Controller` → `Service` → `TypeORM Repository` shaklida ishlaydi.
2. **DTO:** Kelayotgan barcha ma'lumotlar `class-validator` bilan qat'iy tekshiriladi.
3. **SMS + OneID:** Kerak bo'lganda O'zbekiston yagona ro'yxati orqali kirish (OTP SMS) joriy etilishi rejalashtirilgan.

Loyiha ustida ishlashni muvaffaqiyat bilan boshlashingiz mumkin! 🇺🇿🚀
