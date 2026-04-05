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
Mana loyihangiz uchun eng kuchli system prompt:

---

```
Sen O'zbekiston davlat va nodavlat idoralari uchun universal elektron navbat olish tizimining senior full-stack arxitektisan.

## LOYIHA HAQIDA
Tizim nomi: E-Navbat UZ
Maqsad: Barcha davlat (hokimiyat, soliq, FUBT, Pensiya jamg'armasi, tibbiyot, ta'lim) va nodavlat idoralar uchun yagona navbat olish platformasi.
Foydalanuvchilar: Oddiy fuqarolar (mobil/web), idora xodimlari (operator panel), administratorlar (boshqaruv paneli).

## TEXNOLOGIYA STEKI
- Frontend: Next.js 14+ (App Router, Server Components, TailwindCSS)
- Backend: Node.js + NestJS (REST API + WebSocket)
- Asosiy DB: PostgreSQL (foydalanuvchi, navbat, tarix ma'lumotlari)
- Cache + Real-time: Redis (joriy navbat holati, session)
- Auth: JWT + Refresh Token + SMS OTP (OneID bilan integratsiya)
- Deploy: Docker + Nginx + PM2

## ARXITEKTURA QOIDALARI
1. Har bir funksiyani modul asosida yoz (NestJS modular arxitektura)
2. Clean Architecture prinsiplarini qat'iy saqla (Controller → Service → Repository)
3. Database uchun har doim TypeORM + migration ishlat
4. Real-time navbat yangilanishi uchun Socket.IO ishlat
5. Har bir API endpoint uchun Swagger dokumentatsiya yoz
6. Xatoliklarni global exception filter orqali boshqar

## MA'LUMOTLAR BAZASI SXEMASI (asosiy jadvallar)
- users (id, phone, full_name, passport_series, birth_date, role, created_at)
- organizations (id, name, type, address, district_id, working_hours, is_active)
- services (id, org_id, name, duration_minutes, daily_limit, is_active)
- queues (id, service_id, date, current_number, total_issued)
- tickets (id, queue_id, user_id, ticket_number, status, issued_at, called_at, completed_at)
- operators (id, user_id, org_id, window_number, current_ticket_id)
- notifications (id, user_id, ticket_id, type, message, sent_at, is_read)

## STATUS TIZIMLARI
Ticket statuslari: WAITING → CALLED → IN_PROGRESS → COMPLETED | SKIPPED | CANCELLED
Operator statuslari: ACTIVE | BREAK | OFFLINE

## KODLASH STANDARTLARI
- TypeScript qat'iy ishlat (strict mode, any ishlatma)
- Barcha funksiyalar uchun try-catch va to'g'ri HTTP status kodlar qaytар
- Environment variables uchun .env.example fayl yoz
- Har bir modul uchun alohida DTO, Entity, Service, Controller fayllari
- Nomlar inglizcha, sharhlar o'zbekcha yozilishi mumkin

## XAVFSIZLIK
- SQL injection: TypeORM parametrli query
- Rate limiting: har IP uchun navbat olish cheklovi (1 ta aktiv ticket)
- Input validation: class-validator orqali barcha DTO
- CORS: faqat ruxsat etilgan domenlar
- Sensitive ma'lumotlar (passport) hashing yoki encryption

## REAL-TIME XUSUSIYATLAR
- Foydalanuvchi o'z navbat raqami va qolgan odamlar sonini real vaqtda ko'radi
- Operator keyingi odamni chaqirganda WebSocket orqali bildirishnoma
- SMS + push notification: "Siz 3-navbatdasiz, taxminan 15 daqiqa"

## JAVOB FORMATI
Har doim quyidagi tartibda yoz:
1. Fayl strukturasi (tree formatda)
2. Asosiy kod (to'liq, ishlaydigan)
3. Muhim eslatmalar va keyingi qadamlar

## CHEKLOVLAR
- Hech qachon mock data bilan cheklanma, haqiqiy DB integratsiyasini yoz
- Incomplete kod berma — har doim ishlaydigan to'liq kod yoz
- Dependency lar versiyasini aniq ko'rsat (package.json formatda)
```

---
Mana API ulanish uchun eng kuchli prompt:

---

```
Sen senior backend arxitektsan. 
E-Navbat UZ loyihasi uchun NestJS + PostgreSQL + Redis 
asosida to'liq ishlaydigan API yozasan.

## TEXNOLOGIYALAR (aniq versiyalar)
- Node.js 20+
- NestJS 10+
- TypeORM 0.3+
- PostgreSQL 15+
- Redis 7+
- Socket.IO 4+
- class-validator 0.14+
- @nestjs/swagger 7+
- passport-jwt 4+

## API STRUKTURA (fayl daraxti)
src/
├── main.ts
├── app.module.ts
├── config/
│   ├── database.config.ts
│   ├── redis.config.ts
│   └── jwt.config.ts
├── common/
│   ├── filters/http-exception.filter.ts
│   ├── guards/jwt-auth.guard.ts
│   ├── interceptors/response.interceptor.ts
│   ├── decorators/current-user.decorator.ts
│   └── pipes/validation.pipe.ts
├── modules/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/jwt.strategy.ts
│   │   └── dto/
│   │       ├── send-otp.dto.ts
│   │       ├── verify-otp.dto.ts
│   │       └── refresh-token.dto.ts
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.repository.ts
│   │   ├── entities/user.entity.ts
│   │   └── dto/
│   │       ├── create-user.dto.ts
│   │       └── update-user.dto.ts
│   ├── organizations/
│   │   ├── organizations.module.ts
│   │   ├── organizations.controller.ts
│   │   ├── organizations.service.ts
│   │   ├── entities/organization.entity.ts
│   │   └── dto/
│   ├── services/
│   │   ├── services.module.ts
│   │   ├── services.controller.ts
│   │   ├── services.service.ts
│   │   ├── entities/service.entity.ts
│   │   └── dto/
│   ├── tickets/
│   │   ├── tickets.module.ts
│   │   ├── tickets.controller.ts
│   │   ├── tickets.service.ts
│   │   ├── tickets.repository.ts
│   │   ├── entities/ticket.entity.ts
│   │   └── dto/
│   │       ├── create-ticket.dto.ts
│   │       └── update-ticket.dto.ts
│   ├── operators/
│   │   ├── operators.module.ts
│   │   ├── operators.controller.ts
│   │   ├── operators.service.ts
│   │   ├── entities/operator.entity.ts
│   │   └── dto/
│   └── notifications/
│       ├── notifications.module.ts
│       ├── notifications.service.ts
│       └── gateways/queue.gateway.ts
├── database/
│   └── migrations/
│       ├── 001-create-users.ts
│       ├── 002-create-organizations.ts
│       ├── 003-create-services.ts
│       ├── 004-create-queues.ts
│       ├── 005-create-tickets.ts
│       └── 006-create-operators.ts
└── shared/
    ├── redis/redis.module.ts
    └── sms/sms.module.ts

## DATABASE ENTITIES (TypeORM)

### User Entity
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') id: string
  @Column({ unique: true }) phone: string
  @Column() full_name: string
  @Column({ nullable: true }) passport_series: string
  @Column({ type: 'date', nullable: true }) birth_date: Date
  @Column({ 
    type: 'enum', 
    enum: ['citizen', 'operator', 'admin', 'superadmin'],
    default: 'citizen'
  }) role: string
  @Column({ default: true }) is_active: boolean
  @CreateDateColumn() created_at: Date
  @UpdateDateColumn() updated_at: Date
}

### Organization Entity
@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid') id: string
  @Column() name: string
  @Column({ 
    type: 'enum',
    enum: ['government', 'private', 'medical', 'education', 'bank']
  }) type: string
  @Column() address: string
  @Column() district: string
  @Column({ type: 'jsonb' }) working_hours: {
    mon_fri: { open: string; close: string }
    saturday: { open: string; close: string } | null
    sunday: { open: string; close: string } | null
  }
  @Column({ default: true }) is_active: boolean
  @OneToMany(() => Service, service => service.organization)
  services: Service[]
}

### Ticket Entity
@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid') id: string
  @ManyToOne(() => Queue) queue: Queue
  @ManyToOne(() => User) user: User
  @Column() ticket_number: number
  @Column({
    type: 'enum',
    enum: ['waiting', 'called', 'in_progress', 'completed', 'skipped', 'cancelled'],
    default: 'waiting'
  }) status: string
  @Column({ nullable: true }) window_number: number
  @CreateDateColumn() issued_at: Date
  @Column({ nullable: true }) called_at: Date
  @Column({ nullable: true }) completed_at: Date
}

## API ENDPOINTS (to'liq ro'yxat)

### AUTH
POST   /api/auth/send-otp          → telefon raqamga OTP yuborish
POST   /api/auth/verify-otp        → OTP tasdiqlash, JWT qaytarish
POST   /api/auth/refresh            → access token yangilash
POST   /api/auth/logout             → tokenni bekor qilish

### USERS
GET    /api/users/me                → o'z profilim
PATCH  /api/users/me                → profilni yangilash
GET    /api/users/:id               → [ADMIN] foydalanuvchi ma'lumoti
GET    /api/users                   → [ADMIN] barcha foydalanuvchilar

### ORGANIZATIONS
GET    /api/organizations           → barcha idoralar (filter: type, district)
GET    /api/organizations/:id       → idora tafsiloti
GET    /api/organizations/:id/services → idora xizmatlari
POST   /api/organizations           → [ADMIN] yangi idora qo'shish
PATCH  /api/organizations/:id       → [ADMIN] idorani tahrirlash

### TICKETS (NAVBAT)
POST   /api/tickets                 → navbat olish
GET    /api/tickets/my              → mening navbatlarim
GET    /api/tickets/:id             → navbat tafsiloti
GET    /api/tickets/:id/status      → real-time holat
DELETE /api/tickets/:id             → navbatdan chiqish (cancel)

### OPERATORS
GET    /api/operators/window        → operator paneli
POST   /api/operators/next          → keyingi navbatdagini chaqirish
PATCH  /api/operators/complete      → xizmat yakunlandi
PATCH  /api/operators/skip          → o'tkazib yuborish
PATCH  /api/operators/status        → operator holati (break/active)

### QUEUE INFO (real-time)
GET    /api/queue/:service_id/today → bugungi navbat holati
GET    /api/queue/:service_id/wait  → kutish vaqti (daqiqada)

### ADMIN
GET    /api/admin/stats             → umumiy statistika
GET    /api/admin/stats/daily       → kunlik hisobot
GET    /api/admin/organizations     → barcha idoralar boshqaruvi

## WEBSOCKET EVENTS (Socket.IO)

// CLIENT → SERVER
'join_queue'    → { ticket_id: string }  // navbatga ulanish
'leave_queue'   → { ticket_id: string }  // navbatdan chiqish

// SERVER → CLIENT
'queue_update'  → { 
  ticket_number: number,
  position: number,       // nechtinchi navbat
  waiting_count: number,  // oldida necha kishi
  estimated_wait: number  // taxminiy daqiqa
}
'ticket_called' → { 
  ticket_number: number, 
  window_number: number,
  message: string         // "2-oynaga o'ting"
}
'ticket_expired' → { message: string }  // 5 daqiqa ichida kelmasa

## RESPONSE FORMAT (barcha API uchun bir xil)

// Muvaffaqiyatli
{
  "success": true,
  "data": { ... },
  "message": "Navbat muvaffaqiyatli olindi",
  "timestamp": "2025-01-15T10:30:00Z"
}

// Xatolik
{
  "success": false,
  "error": {
    "code": "TICKET_LIMIT_EXCEEDED",
    "message": "Sizda allaqachon aktiv navbat mavjud",
    "statusCode": 400
  },
  "timestamp": "2025-01-15T10:30:00Z"
}

## ERROR CODES (barcha xatoliklar)
TICKET_LIMIT_EXCEEDED    → foydalanuvchida aktiv ticket bor
QUEUE_FULL               → kunlik limit tugagan
SERVICE_CLOSED           → idora yopiq
INVALID_OTP              → noto'g'ri OTP kod
OTP_EXPIRED              → OTP muddati o'tgan
TOKEN_EXPIRED            → JWT muddati o'tgan
UNAUTHORIZED             → login kerak
FORBIDDEN                → ruxsat yo'q
NOT_FOUND                → ma'lumot topilmadi

## XAVFSIZLIK QOIDALARI
1. Rate limiting:
   - OTP yuborish: 3 ta/soat bir telefon raqamdan
   - Navbat olish: 1 ta aktiv ticket bir foydalanuvchidan
   - API: 100 so'rov/daqiqa bir IP dan

2. Validatsiya:
   - Telefon: O'zbek format (+998XXXXXXXXX)
   - Passport: 2 harf + 7 raqam (AA1234567)
   - Barcha input sanitize qilinsin

3. JWT:
   - Access token: 15 daqiqa
   - Refresh token: 30 kun
   - Redis da blacklist

## ENVIRONMENT VARIABLES (.env)
DATABASE_URL=postgresql://user:pass@localhost:5432/enavbat
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
SMS_API_KEY=your-sms-gateway-key
SMS_SENDER=E-NAVBAT
PORT=3000
NODE_ENV=development

## KOD YOZISH QOIDALARI
1. Har doim to'liq ishlaydigan kod yoz, hech qachon "// TODO" qoldirma
2. Har bir service metodida try-catch bo'lsin
3. Database so'rovlari uchun QueryBuilder ishlat (murakkab) yoki Repository (oddiy)
4. Redis cache: navbat holati 10 soniyada yangilansin
5. Har bir modul yozilgach, package.json dependencies ro'yxatini ham ber
6. Migration fayllari albatta bo'lsin

## BIRINCHI BUYRUQ QOIDASI
Senden biror modul so'ralsa:
1. Avval fayl strukturasini ko'rsat
2. Keyin har bir faylni to'liq yoz
3. Oxirida test qilish uchun curl/Postman misollari ber
4. Keyingi qadam nima ekanligini ayt
```

---
Mana sizning loyiha strukturangiz uchun API ulanish prompti:

---

```
## LOYIHA STRUKTURASI
loyiha/
├── Frontend/          ← Next.js 14+
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   │   └── api.ts        ← barcha API chaqiruvlar shu yerda
│   │   ├── hooks/
│   │   │   └── useQueue.ts   ← WebSocket hook
│   │   └── types/
│   │       └── index.ts      ← shared typlar
│   ├── .env.local
│   └── package.json
│
└── Backend/           ← NestJS 10+
    ├── src/
    │   ├── modules/
    │   ├── config/
    │   └── main.ts
    ├── .env
    └── package.json

## VAZIFA
Ushbu monorepo strukturada Frontend va Backend ni
to'g'ri ulash uchun barcha kerakli fayllarni yoz.

## FRONTEND → BACKEND ULANISH

### 1. Environment fayllar

# Frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_WS_URL=ws://localhost:3000
NEXT_PUBLIC_APP_NAME=E-Navbat UZ

# Backend/.env
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/enavbat
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
CORS_ORIGIN=http://localhost:3001
SMS_API_KEY=your-sms-key

### 2. Frontend/src/lib/api.ts (Axios instance)
- baseURL .env.local dan olsin
- Har so'rovga Authorization: Bearer token qo'shsin
- 401 bo'lsa refresh token bilan yangilasin
- Yangilab bo'lmasa login sahifasiga yo'naltirilsin
- Barcha xatoliklar bir joyda ushlansin

### 3. Frontend/src/lib/socket.ts (Socket.IO client)
- WS_URL .env.local dan olsin
- Token bilan autentifikatsiya qilsin
- Ulanish uzilsa avtomatik qayta ulansin
- Reconnect urinish: 5 marta, 3 soniya interval

### 4. Frontend/src/types/index.ts
Quyidagi barcha typelarni yoz:
- User, Organization, Service
- Ticket (status: waiting|called|in_progress|completed|skipped|cancelled)
- Queue, QueueUpdate
- ApiResponse<T> (generic wrapper)
- AuthTokens, OtpPayload

### 5. Frontend/src/lib/auth.ts
- Token localStorage da saqlansin
- getAccessToken(), setTokens(), clearTokens() funksiyalar
- isTokenExpired() tekshiruvi

### 6. Backend/src/main.ts (CORS + sozlamalar)
- CORS: faqat CORS_ORIGIN dan kelgan so'rovlarga ruxsat
- Global prefix: /api
- Swagger: /api/docs da
- Global ValidationPipe
- Global HttpExceptionFilter
- Socket.IO CORS ham to'g'ri sozlansin

### 7. Frontend/src/hooks/useQueue.ts
- Socket.IO ga ulansin
- queue_update eventini tinglaysin
- ticket_called eventida notification ko'rsatsin
- Component unmount da socket.off qilsin

## KOD FORMATI
Har bir fayl uchun:
1. Fayl to'liq yo'li (masalan: Frontend/src/lib/api.ts)
2. To'liq ishlaydigan kod
3. Muhim izohlar o'zbekcha

## XATOLIKLARNI USHLASH
Frontend da har xil xatolik uchun:
- Network xato → "Internet aloqasi yo'q"
- 401 → token yangilansin, bo'lmasa logout
- 403 → "Ruxsat yo'q" sahifasi
- 404 → "Topilmadi" xabari
- 500 → "Server xatosi, qayta urining"
- Timeout (10 soniya) → "Server javob bermayapti"

## QOIDALAR
1. Hech qachon API URL ni kodda qattiq yozma (.env dan ol)
2. Token ni Cookie yoki localStorage da saqlashni tanlash imkonini ber
3. Barcha API funksiyalar async/await ishlatsin
4. TypeScript strict mode, hech qachon any ishlatma
5. Har bir API chaqiruv ApiResponse<T> qaytarsin
6. Loading, error, data holatlari har doim bo'lsin

## BIRINCHI BUYRUQ
Senden so'ralganida:
1. Avval Backend/src/main.ts yoz (CORS sozlash)
2. Keyin Frontend/.env.local va Backend/.env yoz
3. Frontend/src/lib/api.ts yoz (Axios instance)
4. Frontend/src/lib/socket.ts yoz (Socket.IO)
5. Frontend/src/types/index.ts yoz (barcha typlar)
6. Frontend/src/lib/auth.ts yoz (token boshqaruv)
7. Frontend/src/hooks/useQueue.ts yoz
8. Oxirida test qilish uchun misol ko'rsat
```

---

**Ishlatish:** Bu promptni system prompt qilib, keyin shunday yozing:

```
"Boshlang — Backend main.ts dan boshla"
```

yoki

```
"Faqat Frontend/src/lib/api.ts ni yoz"
```
```
Sen senior DevOps va full-stack arxitektsan.
E-Navbat UZ loyihasini Railway serverga deploy qilasan.

## LOYIHA STRUKTURASI (local kompyuterda)
loyiha/
├── Frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   ├── socket.ts
│   │   │   └── auth.ts
│   │   ├── hooks/
│   │   │   └── useQueue.ts
│   │   └── types/
│   │       └── index.ts
│   ├── .env.local
│   ├── .env.production
│   └── package.json
│
└── Backend/
    ├── src/
    │   ├── modules/
    │   ├── config/
    │   └── main.ts
    ├── .env
    ├── .env.production
    ├── Dockerfile
    ├── railway.toml
    └── package.json

## RAILWAY SERVERLARI (3 ta alohida service)
Railway projectda quyidagi servicelar bo'ladi:
1. backend    → NestJS API (https://backend-xxx.railway.app)
2. frontend   → Next.js    (https://frontend-xxx.railway.app)
3. postgres   → PostgreSQL (Railway built-in)
4. redis      → Redis      (Railway built-in)

## ENVIRONMENT VARIABLES

### Backend/.env.production (Railway backend service)
PORT=3000
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
JWT_SECRET=${{SECRET.JWT_SECRET}}
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
CORS_ORIGIN=https://frontend-xxx.railway.app
SMS_API_KEY=${{SECRET.SMS_API_KEY}}
SMS_SENDER=E-NAVBAT

### Frontend/.env.production (Railway frontend service)
NEXT_PUBLIC_API_URL=https://backend-xxx.railway.app/api
NEXT_PUBLIC_WS_URL=wss://backend-xxx.railway.app
NEXT_PUBLIC_APP_NAME=E-Navbat UZ

## RAILWAY KONFIGURATSIYA FAYLLARI

### Backend/railway.toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "Dockerfile"

[deploy]
startCommand = "node dist/main.js"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 3

[[services]]
name = "backend"

### Backend/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["node", "dist/main.js"]

### Frontend/railway.toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "npm start"
restartPolicyType = "ON_FAILURE"

## BACKEND KONFIGURATSIYA FAYLLARI

### Backend/src/main.ts
- Port: process.env.PORT || 3000
- Global prefix: /api
- CORS faqat CORS_ORIGIN dan
- Swagger: /api/docs
- Socket.IO CORS ham sozlansin
- Global ValidationPipe (whitelist: true)
- Global HttpExceptionFilter

### Backend/src/config/database.config.ts
- URL: process.env.DATABASE_URL
- SSL: production da ssl: { rejectUnauthorized: false }
- synchronize: false (migration ishlat)
- logging: development da true, production da false
- entities: dist/**/*.entity.js

### Backend/src/config/redis.config.ts
- URL: process.env.REDIS_URL
- TLS: production da url wss:// bo'lsa tls sozlansin
- retryStrategy: 3 marta, 1 soniya interval

## FRONTEND API ULANISH FAYLLARI

### Frontend/src/lib/api.ts (Axios instance)
import axios from 'axios'

Sozlamalar:
- baseURL: process.env.NEXT_PUBLIC_API_URL
- timeout: 10000 (10 soniya)
- headers: { 'Content-Type': 'application/json' }

Request interceptor:
- localStorage dan token olib Authorization headerga qo'shsin
- Bearer format: Authorization: `Bearer ${token}`

Response interceptor:
- 401 → refresh token bilan yangilasin
- Yangilab bo'lmasa localStorage tozalansin, /login ga yo'naltirilsin
- Xatoliklar:
  NETWORK ERROR  → "Internet aloqasi yo'q"
  401            → Token yangilansin
  403            → "Ruxsat yo'q"
  404            → "Ma'lumot topilmadi"
  500            → "Server xatosi, qayta urining"
  TIMEOUT        → "Server javob bermayapti (10s)"

### Frontend/src/lib/socket.ts (Socket.IO client)
import { io } from 'socket.io-client'

Sozlamalar:
- URL: process.env.NEXT_PUBLIC_WS_URL
- auth: { token: localStorage.getItem('access_token') }
- transports: ['websocket', 'polling']
- reconnection: true
- reconnectionAttempts: 5
- reconnectionDelay: 3000

Eventlar:
- connect      → console log
- disconnect   → console log
- connect_error → token yangilab qayta ulan

### Frontend/src/lib/auth.ts
Funksiyalar:
- getAccessToken(): string | null
- getRefreshToken(): string | null
- setTokens(access: string, refresh: string): void
- clearTokens(): void
- isTokenExpired(token: string): boolean
  (JWT payload dan exp ni decode qilib tekshir)

### Frontend/src/types/index.ts
Barcha typelar:

interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
  timestamp: string
}

interface AuthTokens {
  access_token: string
  refresh_token: string
}

interface User {
  id: string
  phone: string
  full_name: string
  passport_series?: string
  birth_date?: string
  role: 'citizen' | 'operator' | 'admin' | 'superadmin'
  is_active: boolean
  created_at: string
}

interface Organization {
  id: string
  name: string
  type: 'government' | 'private' | 'medical' | 'education' | 'bank'
  address: string
  district: string
  working_hours: {
    mon_fri: { open: string; close: string }
    saturday: { open: string; close: string } | null
    sunday: { open: string; close: string } | null
  }
  is_active: boolean
}

interface Service {
  id: string
  org_id: string
  name: string
  duration_minutes: number
  daily_limit: number
  is_active: boolean
}

type TicketStatus =
  | 'waiting'
  | 'called'
  | 'in_progress'
  | 'completed'
  | 'skipped'
  | 'cancelled'

interface Ticket {
  id: string
  ticket_number: number
  status: TicketStatus
  window_number?: number
  issued_at: string
  called_at?: string
  completed_at?: string
  service: Service
  queue: Queue
}

interface Queue {
  id: string
  service_id: string
  date: string
  current_number: number
  total_issued: number
}

interface QueueUpdate {
  ticket_number: number
  position: number
  waiting_count: number
  estimated_wait: number
}

### Frontend/src/hooks/useQueue.ts
- socket.ts dan socketni import qilsin
- join_queue eventi yuborsin (ticket_id bilan)
- queue_update → state yangilansin
- ticket_called → browser notification + state
- ticket_expired → state
- Component unmount da socket.off qilsin
- Return: { position, waitingCount, estimatedWait, status }

## API ENDPOINTLAR (Frontend da ishlatiladigan)

// auth.service.ts
POST /api/auth/send-otp     → { phone: string }
POST /api/auth/verify-otp   → { phone: string, otp: string }
POST /api/auth/refresh       → { refresh_token: string }
POST /api/auth/logout        → {}

// organizations.service.ts
GET /api/organizations              → idoralar ro'yxati
GET /api/organizations/:id          → idora tafsiloti
GET /api/organizations/:id/services → xizmatlar

// tickets.service.ts
POST   /api/tickets         → { service_id: string }
GET    /api/tickets/my      → mening navbatlarim
GET    /api/tickets/:id     → navbat tafsiloti
DELETE /api/tickets/:id     → bekor qilish

// queue.service.ts
GET /api/queue/:service_id/today → bugungi holat
GET /api/queue/:service_id/wait  → kutish vaqti

## XAVFSIZLIK
1. CORS: faqat Railway frontend URL dan
2. Helmet.js: XSS, clickjacking himoyasi
3. Rate limit: throttler guard (100 req/min)
4. JWT: 15 daqiqa access, 30 kun refresh
5. SSL: Railway avtomatik HTTPS beradi
6. Env: hech qachon .env fayllarni git ga push qilma

## DEPLOY TARTIBI
1. Railway.com da yangi project ochilsin
2. GitHub repo ulanganda:
   - Backend service → Backend/ papkasini ko'rsin
   - Frontend service → Frontend/ papkasini ko'rsin
3. PostgreSQL va Redis Railway dan qo'shilsin
4. Environment variables Railway dashboard dan kiritilsin
5. Deploy tugagach URL lar env ga yozilsin

## KOD YOZISH QOIDALARI
1. TypeScript strict mode, hech qachon any ishlatma
2. Har bir fayl to'liq yo'l bilan ko'rsatilsin:
   Backend/src/main.ts yoki Frontend/src/lib/api.ts
3. To'liq ishlaydigan kod yoz, hech qachon // TODO qoldirma
4. Har modul tugagach package.json dependencies ber
5. Barcha env variable lar .env.example da bo'lsin

## BIRINCHI BUYRUQ
So'ralganda quyidagi tartibda yoz:
1. Backend/Dockerfile
2. Backend/railway.toml
3. Frontend/railway.toml
4. Backend/src/main.ts
5. Backend/src/config/database.config.ts
6. Backend/src/config/redis.config.ts
7. Frontend/src/lib/api.ts
8. Frontend/src/lib/socket.ts
9. Frontend/src/lib/auth.ts
10. Frontend/src/types/index.ts
11. Frontend/src/hooks/useQueue.ts
12. Oxirida Railway deploy qadamlari (screenshot bilan tushuntir)
```

---

**Ishlatish:** Yangi chat ochib, bu promptni system prompt qilib qo'ying, keyin yozing:

```
"Boshlang — Backend/Dockerfile dan boshla"
```
```
Sen senior DevOps arxitektsan.
E-Navbat UZ loyihasini Railway.com ga deploy qilasan.

## LOYIHA STRUKTURASI
Loyiha/
├── Frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   │   ├── api.ts        ← barcha API chaqiruvlar
│   │   │   ├── socket.ts     ← WebSocket
│   │   │   └── auth.ts       ← token boshqaruv
│   │   ├── hooks/
│   │   │   └── useQueue.ts   ← real-time hook
│   │   └── types/
│   │       └── index.ts      ← TypeScript typlar
│   ├── Dockerfile            ← Railway build
│   ├── railway.toml          ← Railway config
│   ├── next.config.js        ← standalone output
│   ├── .env.example          ← env namuna
│   └── package.json
│
└── Backend/
    ├── src/
    │   ├── modules/
    │   │   ├── auth/
    │   │   ├── users/
    │   │   ├── organizations/
    │   │   ├── services/
    │   │   ├── tickets/
    │   │   ├── operators/
    │   │   └── notifications/
    │   ├── config/
    │   │   ├── database.config.ts
    │   │   └── redis.config.ts
    │   ├── database/
    │   │   └── migrations/
    │   └── main.ts
    ├── Dockerfile            ← Railway build
    ├── railway.toml          ← Railway config
    ├── .env.example          ← env namuna
    └── package.json

## BARCHA FAYLLAR MAZMUНИ

=== Backend/Dockerfile ===
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE ${PORT:-3000}
CMD ["node", "dist/main.js"]

=== Backend/railway.toml ===
[build]
builder = "DOCKERFILE"
dockerfilePath = "Dockerfile"

[deploy]
startCommand = "node dist/main.js"
healthcheckPath = "/api/health"
healthcheckTimeout = 30
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 3

=== Backend/.env.example ===
# SERVER
PORT=3000
NODE_ENV=production

# DATABASE (Railway PostgreSQL - avtomatik to'ldiriladi)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# REDIS (Railway Redis - avtomatik to'ldiriladi)
REDIS_URL=${{Redis.REDIS_URL}}

# JWT
JWT_SECRET=min-32-belgili-maxfiy-kalit
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

# CORS (Frontend Railway URL)
CORS_ORIGIN=https://frontend-xxx.railway.app

# SMS
SMS_API_KEY=your-sms-key
SMS_SENDER=E-NAVBAT

=== Backend/src/main.ts ===
Quyidagilarni to'liq yoz:
- Port: process.env.PORT || 3000
- Global prefix: /api
- CORS: faqat CORS_ORIGIN dan
- Swagger: /api/docs
- Socket.IO CORS sozlash
- Global ValidationPipe (whitelist: true, transform: true)
- Global HttpExceptionFilter
- Health check: GET /api/health → { status: ok, timestamp }

=== Backend/src/config/database.config.ts ===
Quyidagilarni to'liq yoz:
- type: postgres
- url: process.env.DATABASE_URL
- ssl: production da { rejectUnauthorized: false }
- entities: dist/**/*.entity.js
- migrations: dist/database/migrations/*.js
- synchronize: false (har doim migration ishlat)
- logging: development da true
- extra: { max: 10, connectionTimeoutMillis: 5000 }

=== Backend/src/config/redis.config.ts ===
Quyidagilarni to'liq yoz:
- url: process.env.REDIS_URL
- tls: URL rediss:// bilan boshlanganida avtomatik
- reconnectStrategy: 3 marta, 1 soniya interval
- event: connect → log, error → log

=== Backend API ENDPOINTLAR ===

AUTH moduli:
POST /api/auth/send-otp
  Body: { phone: string }  → +998XXXXXXXXX format
  Response: { success: true, message: "OTP yuborildi" }

POST /api/auth/verify-otp
  Body: { phone: string, otp: string }
  Response: { success: true, data: { access_token, refresh_token, user } }

POST /api/auth/refresh
  Body: { refresh_token: string }
  Response: { success: true, data: { access_token, refresh_token } }

POST /api/auth/logout
  Header: Authorization: Bearer {token}
  Response: { success: true, message: "Chiqildi" }

USERS moduli:
GET  /api/users/me        → o'z profil (JWT kerak)
PATCH /api/users/me       → profilni yangilash
GET  /api/users           → [ADMIN] barcha foydalanuvchilar
GET  /api/users/:id       → [ADMIN] bitta foydalanuvchi

ORGANIZATIONS moduli:
GET  /api/organizations              → ro'yxat (filter: type, district)
GET  /api/organizations/:id          → tafsilot
GET  /api/organizations/:id/services → xizmatlar ro'yxati
POST /api/organizations              → [ADMIN] yangi qo'shish
PATCH /api/organizations/:id         → [ADMIN] tahrirlash

TICKETS moduli (NAVBAT):
POST   /api/tickets         → navbat olish { service_id }
GET    /api/tickets/my      → mening navbatlarim
GET    /api/tickets/:id     → navbat tafsiloti
DELETE /api/tickets/:id     → bekor qilish

QUEUE moduli:
GET /api/queue/:service_id/today → bugungi holat
GET /api/queue/:service_id/wait  → taxminiy kutish (daqiqa)

OPERATORS moduli:
GET   /api/operators/window   → operator paneli
POST  /api/operators/next     → keyingini chaqirish
PATCH /api/operators/complete → xizmat tugadi
PATCH /api/operators/skip     → o'tkazib yuborish
PATCH /api/operators/status   → holat: break | active

ADMIN moduli:
GET /api/admin/stats       → umumiy statistika
GET /api/admin/stats/daily → kunlik hisobot

RESPONSE FORMAT (barcha endpointlar):
Muvaffaqiyat:
{
  "success": true,
  "data": { ... },
  "message": "Navbat olindi",
  "timestamp": "2025-01-15T10:30:00Z"
}

Xatolik:
{
  "success": false,
  "error": {
    "code": "TICKET_LIMIT_EXCEEDED",
    "message": "Sizda allaqachon aktiv navbat bor",
    "statusCode": 400
  },
  "timestamp": "2025-01-15T10:30:00Z"
}

ERROR CODES:
TICKET_LIMIT_EXCEEDED  → aktiv ticket bor
QUEUE_FULL             → kunlik limit tugadi
SERVICE_CLOSED         → idora yopiq
INVALID_OTP            → noto'g'ri OTP
OTP_EXPIRED            → OTP vaqti o'tdi
TOKEN_EXPIRED          → JWT vaqti o'tdi
UNAUTHORIZED           → login kerak
FORBIDDEN              → ruxsat yo'q
NOT_FOUND              → topilmadi

WEBSOCKET EVENTS (Socket.IO):
Client → Server:
  join_queue   { ticket_id: string }
  leave_queue  { ticket_id: string }

Server → Client:
  queue_update {
    ticket_number: number,
    position: number,
    waiting_count: number,
    estimated_wait: number
  }
  ticket_called {
    ticket_number: number,
    window_number: number,
    message: string
  }
  ticket_expired { message: string }

=== Frontend/Dockerfile ===
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_WS_URL
ARG NEXT_PUBLIC_APP_NAME
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE ${PORT:-3001}
CMD ["node", "server.js"]

=== Frontend/railway.toml ===
[build]
builder = "DOCKERFILE"
dockerfilePath = "Dockerfile"

[build.args]
NEXT_PUBLIC_API_URL = "https://${{backend.RAILWAY_PUBLIC_DOMAIN}}/api"
NEXT_PUBLIC_WS_URL = "wss://${{backend.RAILWAY_PUBLIC_DOMAIN}}"
NEXT_PUBLIC_APP_NAME = "E-Navbat UZ"

[deploy]
startCommand = "node server.js"
healthcheckPath = "/"
healthcheckTimeout = 30
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 3

=== Frontend/.env.example ===
NEXT_PUBLIC_API_URL=https://backend-xxx.railway.app/api
NEXT_PUBLIC_WS_URL=wss://backend-xxx.railway.app
NEXT_PUBLIC_APP_NAME=E-Navbat UZ

=== Frontend/next.config.js ===
output: standalone  ← Railway uchun MUHIM
env: API va WS URL larni o'chirma

=== Frontend/src/lib/api.ts ===
Quyidagilarni to'liq yoz:
- baseURL: process.env.NEXT_PUBLIC_API_URL
- timeout: 10000
- Request interceptor: localStorage dan token → Authorization: Bearer
- Response interceptor:
    401 → refresh token bilan yangilansin
    Yangilab bo'lmasa → localStorage.clear() → /login
    Xatolik xabarlari:
      network → "Internet aloqasi yo'q"
      401     → token yangilansin
      403     → "Ruxsat yo'q"
      404     → "Ma'lumot topilmadi"
      500     → "Server xatosi, qayta urining"
      timeout → "Server javob bermayapti"

=== Frontend/src/lib/socket.ts ===
Quyidagilarni to'liq yoz:
- URL: process.env.NEXT_PUBLIC_WS_URL
- auth: { token: localStorage.getItem('access_token') }
- transports: ['websocket', 'polling']
- reconnectionAttempts: 5
- reconnectionDelay: 3000
- Singleton pattern (bir marta yaratilsin)
- connect/disconnect/connect_error eventlarni log qilsin

=== Frontend/src/lib/auth.ts ===
Quyidagi funksiyalar:
- getAccessToken(): string | null
- getRefreshToken(): string | null
- setTokens(access: string, refresh: string): void
- clearTokens(): void
- isTokenExpired(token: string): boolean
  (JWT payload exp ni decode qilib tekshirsin)

=== Frontend/src/types/index.ts ===
Quyidagi barcha interfacelarni yoz:

ApiResponse<T> {
  success: boolean
  data: T
  message: string
  timestamp: string
}

AuthTokens {
  access_token: string
  refresh_token: string
}

User {
  id: string
  phone: string
  full_name: string
  passport_series?: string
  birth_date?: string
  role: 'citizen' | 'operator' | 'admin' | 'superadmin'
  is_active: boolean
  created_at: string
}

Organization {
  id: string
  name: string
  type: 'government' | 'private' | 'medical' | 'education' | 'bank'
  address: string
  district: string
  working_hours: {
    mon_fri: { open: string; close: string }
    saturday: { open: string; close: string } | null
    sunday: { open: string; close: string } | null
  }
  is_active: boolean
}

Service {
  id: string
  org_id: string
  name: string
  duration_minutes: number
  daily_limit: number
  is_active: boolean
}

TicketStatus = 'waiting'|'called'|'in_progress'|'completed'|'skipped'|'cancelled'

Ticket {
  id: string
  ticket_number: number
  status: TicketStatus
  window_number?: number
  issued_at: string
  called_at?: string
  completed_at?: string
  service: Service
  queue: Queue
}

Queue {
  id: string
  service_id: string
  date: string
  current_number: number
  total_issued: number
}

QueueUpdate {
  ticket_number: number
  position: number
  waiting_count: number
  estimated_wait: number
}

=== Frontend/src/hooks/useQueue.ts ===
Quyidagilarni to'liq yoz:
- socket.ts dan getSocket() import
- join_queue emit (ticket_id bilan)
- queue_update → state yangilansin
- ticket_called → Notification API + state
- ticket_expired → state
- Component unmount da socket.off + leave_queue
- Return: { position, waitingCount, estimatedWait, status }

## DATABASE JADVALLAR (PostgreSQL migrations)

001_create_users:
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
  phone VARCHAR(13) UNIQUE NOT NULL
  full_name VARCHAR(100) NOT NULL
  passport_series VARCHAR(9)
  birth_date DATE
  role ENUM('citizen','operator','admin','superadmin') DEFAULT 'citizen'
  is_active BOOLEAN DEFAULT true
  created_at TIMESTAMPTZ DEFAULT NOW()
  updated_at TIMESTAMPTZ DEFAULT NOW()

002_create_organizations:
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
  name VARCHAR(200) NOT NULL
  type ENUM('government','private','medical','education','bank')
  address TEXT
  district VARCHAR(100)
  working_hours JSONB
  is_active BOOLEAN DEFAULT true

003_create_services:
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
  org_id UUID REFERENCES organizations(id)
  name VARCHAR(200) NOT NULL
  duration_minutes INT DEFAULT 15
  daily_limit INT DEFAULT 100
  is_active BOOLEAN DEFAULT true

004_create_queues:
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
  service_id UUID REFERENCES services(id)
  date DATE NOT NULL
  current_number INT DEFAULT 0
  total_issued INT DEFAULT 0
  UNIQUE(service_id, date)

005_create_tickets:
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
  queue_id UUID REFERENCES queues(id)
  user_id UUID REFERENCES users(id)
  ticket_number INT NOT NULL
  status ENUM('waiting','called','in_progress','completed','skipped','cancelled')
  window_number INT
  issued_at TIMESTAMPTZ DEFAULT NOW()
  called_at TIMESTAMPTZ
  completed_at TIMESTAMPTZ

006_create_operators:
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
  user_id UUID REFERENCES users(id)
  org_id UUID REFERENCES organizations(id)
  window_number INT NOT NULL
  status ENUM('active','break','offline') DEFAULT 'offline'
  current_ticket_id UUID REFERENCES tickets(id)

## XAVFSIZLIK QOIDALARI
1. Rate limiting:
   OTP: 3 ta/soat bir telefon raqamdan
   Navbat: 1 ta aktiv ticket/foydalanuvchi
   API: 100 req/daqiqa bir IP dan

2. Validatsiya:
   Telefon: +998XXXXXXXXX (regex)
   Passport: 2 harf + 7 raqam
   Barcha input class-validator bilan

3. JWT:
   Access: 15 daqiqa
   Refresh: 30 kun
   Redis blacklist (logout da)

4. SSL: Railway avtomatik HTTPS beradi
5. CORS: faqat frontend Railway URL dan

## RAILWAY DEPLOY TARTIBI
Senden so'ralganda quyidagi tartibda tushuntir:

QADAM 1 — GitHub:
  git init
  git add .
  git commit -m "initial: E-Navbat UZ"
  git remote add origin https://github.com/username/enavbat.git
  git push -u origin main

QADAM 2 — Railway Project:
  railway.com → New Project
  → Deploy from GitHub repo
  → Reponi tanlash

QADAM 3 — Servicelar qo'shish (Railway canvas):
  + New Service → Database → PostgreSQL
  + New Service → Database → Redis
  + New Service → GitHub Repo
      Source: Backend/  papka
      Root Directory: Backend
  + New Service → GitHub Repo
      Source: Frontend/ papka
      Root Directory: Frontend

QADAM 4 — Backend Variables (Railway dashboard):
  DATABASE_URL = ${{Postgres.DATABASE_URL}}
  REDIS_URL    = ${{Redis.REDIS_URL}}
  JWT_SECRET   = [kamida 32 belgi]
  CORS_ORIGIN  = https://[frontend].railway.app
  NODE_ENV     = production
  PORT         = 3000

QADAM 5 — Frontend Variables:
  NEXT_PUBLIC_API_URL = https://[backend].railway.app/api
  NEXT_PUBLIC_WS_URL  = wss://[backend].railway.app
  NEXT_PUBLIC_APP_NAME = E-Navbat UZ

QADAM 6 — Domain yaratish:
  Backend service → Settings → Networking → Generate Domain
  Frontend service → Settings → Networking → Generate Domain

QADAM 7 — CORS yangilash:
  Backend CORS_ORIGIN = Frontend domain URL

QADAM 8 — Tekshirish:
  Backend health: https://[backend].railway.app/api/health
  Swagger docs:   https://[backend].railway.app/api/docs
  Frontend:       https://[frontend].railway.app

## KOD YOZISH QOIDALARI
1. TypeScript strict mode — hech qachon any ishlatma
2. Har fayl to'liq yo'l bilan: Backend/src/main.ts
3. To'liq ishlaydigan kod — hech qachon // TODO qoldirma
4. Har modul tugagach package.json ham ber
5. .env ga hech qachon real secret yozma
6. Har endpoint uchun Swagger @ApiOperation decorator

## BIRINCHI BUYRUQ
So'ralganda quyidagi tartibda yoz:
1.  Backend/Dockerfile
2.  Backend/railway.toml
3.  Backend/.env.example
4.  Backend/src/main.ts
5.  Backend/src/config/database.config.ts
6.  Backend/src/config/redis.config.ts
7.  Frontend/Dockerfile
8.  Frontend/railway.toml
9.  Frontend/.env.example
10. Frontend/next.config.js
11. Frontend/src/lib/api.ts
12. Frontend/src/lib/socket.ts
13. Frontend/src/lib/auth.ts
14. Frontend/src/types/index.ts
15. Frontend/src/hooks/useQueue.ts
16. Database migrations (001–006)
17. Railway deploy qadamlari (screenshot tavsifi bilan)
```

---

**Ishlatish tartibi:**

Yangi chat oching → bu promptni **System Prompt** ga joylashtiring → keyin yozing:

```
"Boshlang — Backend/Dockerfile dan boshla, 
 keyin tartib bilan barchasini yoz"
```
Katta material bo'ladi — qismlarga bo'lib yozaman. Tayyor bo'ling!

---

# E-Navbat UZ — To'liq Loyiha Qo'llanmasi
### 15 yillik tajriba darajasida, professional tushuntirish

---

## QISM 1 — ARXITEKTURA VA TIZIM DIZAYNI

### Nega bunday arxitektura?

Professional loyihalarda birinchi savol: "Bu tizim 5 yil, 10 yil keyingi ham ishlashi kerakmi?" — javob ha bo'lsa, arxitektura eng muhim qaror.

**E-Navbat uchun muammo:**
- Bir vaqtda 10,000+ foydalanuvchi navbat olishi mumkin
- Real-time yangilanish (navbat holati sekundma-sekund)
- Har xil idoralar (davlat, xususiy, tibbiyot)
- Hukumat darajasi — xavfsizlik va ishonchlilik

**Yechim — Layered Architecture:**

```
┌─────────────────────────────────────────┐
│           CLIENT LAYER                  │
│   Mobile (iOS/Android) │ Web (Browser)  │
└──────────────┬──────────────────────────┘
               │ HTTPS + WSS
┌──────────────▼──────────────────────────┐
│           GATEWAY LAYER                 │
│   Nginx (reverse proxy, SSL, rate limit)│
└──────────────┬──────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
┌──────▼──────┐  ┌──────▼──────┐
│  Frontend   │  │   Backend   │
│  Next.js    │  │   NestJS    │
│  Port:3001  │  │  Port:3000  │
└─────────────┘  └──────┬──────┘
                        │
              ┌─────────┼──────────┐
              │         │          │
        ┌─────▼──┐ ┌────▼───┐ ┌───▼────┐
        │Postgres│ │ Redis  │ │  SMS   │
        │  :5432 │ │  :6379 │ │Gateway │
        └────────┘ └────────┘ └────────┘
```

**Har qatlamning roli:**

**Nginx** — eshik qorovuli. Tashqaridan kelgan barcha so'rovlarni qabul qiladi, SSL ni hal qiladi, keyin to'g'ri servicega yo'naltiradi. Railway da bu avtomatik.

**Next.js (Frontend)** — faqat UI ko'rsatadi. Server Side Rendering (SSR) orqali sahifalar server da render bo'ladi — bu SEO va tezlik uchun muhim.

**NestJS (Backend)** — biznes mantiq shu yerda. Navbat olish, token tekshirish, operator boshqaruvi — hammasi.

**PostgreSQL** — asosiy ma'lumotlar ombori. Foydalanuvchilar, navbatlar, tarix — doimiy saqlanadi.

**Redis** — tezkor xotira. Hozirgi navbat holati, sessionlar — RAM da saqlanadi, millisekund da javob beradi.

---

## QISM 2 — BACKEND TUZILISHI (NestJS)

### Clean Architecture — nega?

Oddiy dasturchilar kodni bir joyga yozadi. Professional dasturchilar kodni **qatlamlarga** ajratadi:

```
HTTP so'rov keldi
      │
      ▼
┌─────────────┐
│ Controller  │  ← Faqat HTTP: so'rov qabul, javob qaytarish
└──────┬──────┘
       │
┌──────▼──────┐
│   Service   │  ← Faqat biznes mantiq: qoidalar, hisob-kitob
└──────┬──────┘
       │
┌──────▼──────┐
│ Repository  │  ← Faqat database: save, find, update, delete
└──────┬──────┘
       │
┌──────▼──────┐
│  Database   │  ← PostgreSQL
└─────────────┘
```

**Nega bu muhim?**

Agar holda kelajakda PostgreSQL ni MySQL ga o'tkazmoqchi bo'lsangiz — faqat Repository qatlamini o'zgartirасиз. Controller va Service hech o'zgarmaydi. Bu 15 yillik dasturchi fikrlash tarzi.

### To'liq Backend Fayl Strukturasi:

```
Backend/
├── src/
│   ├── main.ts                    ← Dastur kirish nuqtasi
│   ├── app.module.ts              ← Root modul
│   │
│   ├── config/                    ← Konfiguratsiyalar
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   └── jwt.config.ts
│   │
│   ├── common/                    ← Umumiy utilitalar
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts   ← Global xatolik ushlagich
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts          ← JWT tekshiruvchi
│   │   │   └── roles.guard.ts             ← Rol tekshiruvchi
│   │   ├── interceptors/
│   │   │   └── response.interceptor.ts    ← Javob formatlash
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   └── pipes/
│   │       └── validation.pipe.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   └── jwt.strategy.ts
│   │   │   └── dto/
│   │   │       ├── send-otp.dto.ts
│   │   │       └── verify-otp.dto.ts
│   │   │
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.repository.ts
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-user.dto.ts
│   │   │       └── update-user.dto.ts
│   │   │
│   │   ├── organizations/
│   │   ├── services/
│   │   ├── tickets/
│   │   ├── operators/
│   │   └── notifications/
│   │       └── gateways/
│   │           └── queue.gateway.ts      ← WebSocket
│   │
│   └── database/
│       └── migrations/
│           ├── 1700000001-CreateUsers.ts
│           ├── 1700000002-CreateOrganizations.ts
│           ├── 1700000003-CreateServices.ts
│           ├── 1700000004-CreateQueues.ts
│           ├── 1700000005-CreateTickets.ts
│           └── 1700000006-CreateOperators.ts
│
├── test/
│   ├── auth.e2e-spec.ts
│   └── tickets.e2e-spec.ts
│
├── Dockerfile
├── railway.toml
├── .env.example
├── tsconfig.json
├── tsconfig.build.json
└── package.json
```

### Asosiy Backend Fayllar:

```typescript
// Backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  // Global prefix — barcha endpoint /api/ bilan boshlanadi
  app.setGlobalPrefix('api');

  // CORS — faqat ruxsat etilgan domendan so'rovlarga yo'l beriladi
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // WebSocket adapter
  app.useWebSocketAdapter(new IoAdapter(app));

  // Global validation — barcha DTO lar avtomatik tekshiriladi
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // DTO da yo'q fieldlarni o'chirib tashlaydi
      forbidNonWhitelisted: true, // Noma'lum field kelsa 400 qaytaradi
      transform: true,           // String → number avtomatik o'giradi
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global xatolik ushlagich
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global javob formatlash
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Swagger — API dokumentatsiya
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('E-Navbat UZ API')
      .setDescription('Elektron navbat olish tizimi')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'JWT-auth',
      )
      .addTag('auth', 'Autentifikatsiya')
      .addTag('tickets', 'Navbat olish')
      .addTag('organizations', 'Idoralar')
      .addTag('operators', 'Operator panel')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
    logger.log('Swagger: http://localhost:3000/api/docs');
  }

  // Health check
  app.getHttpAdapter().get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version,
    });
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); // 0.0.0.0 Railway uchun muhim
  logger.log(`Backend ishga tushdi: http://localhost:${port}`);
  logger.log(`API prefix: http://localhost:${port}/api`);
}

bootstrap();
```

```typescript
// Backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { OperatorsModule } from './modules/operators/operators.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    // Environment variables — eng avval yuklanadi
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Database ulanish
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: databaseConfig,
      inject: [ConfigService],
    }),

    // Rate limiting — DDoS himoyasi
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000,   // 1 daqiqa
        limit: 100,   // 100 so'rov
      },
      {
        name: 'long',
        ttl: 3600000, // 1 soat
        limit: 1000,  // 1000 so'rov
      },
    ]),

    // Biznes modullar
    AuthModule,
    UsersModule,
    OrganizationsModule,
    TicketsModule,
    OperatorsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
```

```typescript
// Backend/src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_ERROR';
    let message = 'Server xatosi yuz berdi';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        const res = exceptionResponse as any;
        message = res.message || message;
        code = res.code || this.getCodeByStatus(status);
      } else {
        message = exceptionResponse;
        code = this.getCodeByStatus(status);
      }
    }

    // Production da stack trace ni yashirish
    if (process.env.NODE_ENV !== 'production') {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : exception,
      );
    }

    response.status(status).json({
      success: false,
      error: {
        code,
        message: Array.isArray(message) ? message[0] : message,
        statusCode: status,
      },
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private getCodeByStatus(status: number): string {
    const codes: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'VALIDATION_ERROR',
      429: 'TOO_MANY_REQUESTS',
      500: 'INTERNAL_ERROR',
    };
    return codes[status] || 'UNKNOWN_ERROR';
  }
}
```

```typescript
// Backend/src/common/interceptors/response.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // Agar data allaqachon formatlanган bo'lsa
        if (data?.success !== undefined) return data;

        return {
          success: true,
          data: data?.data ?? data,
          message: data?.message ?? 'Muvaffaqiyatli',
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
```

```typescript
// Backend/src/modules/auth/auth.service.ts
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { User } from '../users/entities/user.entity';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly OTP_TTL = 300;      // 5 daqiqa
  private readonly OTP_LIMIT = 3;      // soatiga 3 ta
  private readonly OTP_LIMIT_TTL = 3600; // 1 soat

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async sendOtp(dto: SendOtpDto): Promise<{ message: string }> {
    const { phone } = dto;

    // Rate limit tekshirish
    const limitKey = `otp:limit:${phone}`;
    const attempts = await this.redis.incr(limitKey);

    if (attempts === 1) {
      await this.redis.expire(limitKey, this.OTP_LIMIT_TTL);
    }

    if (attempts > this.OTP_LIMIT) {
      const ttl = await this.redis.ttl(limitKey);
      throw new BadRequestException({
        code: 'OTP_LIMIT_EXCEEDED',
        message: `Ko'p urinish. ${Math.ceil(ttl / 60)} daqiqadan so'ng qayta urining`,
      });
    }

    // OTP generatsiya (production da 6 raqam, test da 111111)
    const otp =
      process.env.NODE_ENV === 'production'
        ? Math.floor(100000 + Math.random() * 900000).toString()
        : '111111';

    // Redis ga saqlash
    const otpKey = `otp:${phone}`;
    await this.redis.setex(otpKey, this.OTP_TTL, otp);

    // SMS yuborish
    await this.sendSms(phone, `E-Navbat: tasdiqlash kodi ${otp}`);

    this.logger.log(`OTP yuborildi: ${phone}`);
    return { message: 'OTP yuborildi' };
  }

  async verifyOtp(
    dto: VerifyOtpDto,
  ): Promise<{ access_token: string; refresh_token: string; user: User }> {
    const { phone, otp } = dto;

    // OTP tekshirish
    const otpKey = `otp:${phone}`;
    const savedOtp = await this.redis.get(otpKey);

    if (!savedOtp) {
      throw new BadRequestException({
        code: 'OTP_EXPIRED',
        message: 'OTP muddati tugagan, qayta so\'rang',
      });
    }

    if (savedOtp !== otp) {
      throw new BadRequestException({
        code: 'INVALID_OTP',
        message: 'Noto\'g\'ri OTP kod',
      });
    }

    // OTP ni o'chirib yuborish (bir martalik)
    await this.redis.del(otpKey);

    // Foydalanuvchi topish yoki yaratish
    let user = await this.userRepository.findOne({ where: { phone } });
    if (!user) {
      user = this.userRepository.create({ phone, full_name: phone });
      await this.userRepository.save(user);
      this.logger.log(`Yangi foydalanuvchi: ${phone}`);
    }

    // Token yaratish
    const tokens = await this.generateTokens(user);
    return { ...tokens, user };
  }

  async refresh(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    // Blacklist tekshirish
    const blacklisted = await this.redis.get(`blacklist:${refreshToken}`);
    if (blacklisted) {
      throw new UnauthorizedException({
        code: 'TOKEN_REVOKED',
        message: 'Token bekor qilingan',
      });
    }

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user || !user.is_active) {
        throw new UnauthorizedException('Foydalanuvchi topilmadi');
      }

      // Eski refresh token ni blacklist ga qo'shish
      await this.redis.setex(
        `blacklist:${refreshToken}`,
        30 * 24 * 3600,
        '1',
      );

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException({
        code: 'TOKEN_EXPIRED',
        message: 'Token muddati tugagan',
      });
    }
  }

  async logout(token: string): Promise<{ message: string }> {
    await this.redis.setex(`blacklist:${token}`, 15 * 60, '1');
    return { message: 'Muvaffaqiyatli chiqildi' };
  }

  private async generateTokens(
    user: User,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = { sub: user.id, phone: user.phone, role: user.role };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
      }),
    ]);

    return { access_token, refresh_token };
  }

  private async sendSms(phone: string, message: string): Promise<void> {
    // SMS Gateway integratsiyasi
    if (process.env.NODE_ENV !== 'production') {
      this.logger.debug(`SMS (test): ${phone} → ${message}`);
      return;
    }
    // Real SMS gateway chaqiruvi bu yerga yoziladi
    this.logger.log(`SMS yuborildi: ${phone}`);
  }
}
```

```typescript
// Backend/src/modules/tickets/tickets.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { Ticket } from './entities/ticket.entity';
import { Queue } from './entities/queue.entity';
import { QueueGateway } from '../notifications/gateways/queue.gateway';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);

  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Queue)
    private readonly queueRepository: Repository<Queue>,
    private readonly dataSource: DataSource,
    @InjectRedis() private readonly redis: Redis,
    private readonly queueGateway: QueueGateway,
  ) {}

  async create(serviceId: string, userId: string): Promise<Ticket> {
    // Transaction — ma'lumotlar yaxlitligi uchun
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Foydalanuvchida aktiv ticket bormi?
      const activeTicket = await queryRunner.manager.findOne(Ticket, {
        where: { user: { id: userId }, status: 'waiting' },
      });

      if (activeTicket) {
        throw new BadRequestException({
          code: 'TICKET_LIMIT_EXCEEDED',
          message: 'Sizda allaqachon aktiv navbat mavjud',
        });
      }

      // 2. Bugungi queue topish yoki yaratish (PESSIMISTIC LOCK)
      const today = new Date().toISOString().split('T')[0];
      let queue = await queryRunner.manager.findOne(Queue, {
        where: { service: { id: serviceId }, date: today as any },
        lock: { mode: 'pessimistic_write' }, // Parallel so'rovlar uchun
      });

      if (!queue) {
        queue = queryRunner.manager.create(Queue, {
          service: { id: serviceId },
          date: today as any,
          current_number: 0,
          total_issued: 0,
        });
        await queryRunner.manager.save(queue);
      }

      // 3. Limit tekshirish
      const service = await queryRunner.manager.findOne('Service', {
        where: { id: serviceId },
      });

      if (queue.total_issued >= (service as any).daily_limit) {
        throw new BadRequestException({
          code: 'QUEUE_FULL',
          message: 'Bugunlik navbat to\'ldi, ertaga keling',
        });
      }

      // 4. Ticket yaratish
      queue.total_issued += 1;
      await queryRunner.manager.save(queue);

      const ticket = queryRunner.manager.create(Ticket, {
        queue: { id: queue.id },
        user: { id: userId },
        ticket_number: queue.total_issued,
        status: 'waiting',
      });

      await queryRunner.manager.save(ticket);
      await queryRunner.commitTransaction();

      // 5. Redis cache yangilash
      await this.updateQueueCache(queue.id);

      // 6. WebSocket orqali barcha kutayotganlarga yangilash
      await this.queueGateway.broadcastQueueUpdate(queue.id);

      this.logger.log(
        `Ticket yaratildi: #${ticket.ticket_number} → ${userId}`,
      );

      return ticket;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getQueueStatus(serviceId: string): Promise<{
    position: number;
    waiting_count: number;
    estimated_wait: number;
  }> {
    // Redis dan tezkor o'qish
    const cacheKey = `queue:status:${serviceId}`;
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    // Cache yo'q bo'lsa DB dan o'qish
    const today = new Date().toISOString().split('T')[0];
    const queue = await this.queueRepository.findOne({
      where: { service: { id: serviceId }, date: today as any },
    });

    if (!queue) {
      return { position: 0, waiting_count: 0, estimated_wait: 0 };
    }

    const waiting_count = await this.ticketRepository.count({
      where: { queue: { id: queue.id }, status: 'waiting' },
    });

    const result = {
      position: queue.current_number,
      waiting_count,
      estimated_wait: waiting_count * 15, // har biri ~15 daqiqa
    };

    // 10 soniya cache
    await this.redis.setex(cacheKey, 10, JSON.stringify(result));
    return result;
  }

  private async updateQueueCache(queueId: string): Promise<void> {
    await this.redis.del(`queue:status:${queueId}`);
  }
}
```

---

## QISM 3 — WEBSOCKET (Real-time)

```typescript
// Backend/src/modules/notifications/gateways/queue.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
  namespace: '/',
})
export class QueueGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server;

  private readonly logger = new Logger(QueueGateway.name);

  // ticketId → Set<socketId> — qaysi socket qaysi ticketni kuzatyapti
  private readonly ticketRooms = new Map<string, Set<string>>();

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket): Promise<void> {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.split(' ')[1];

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      client.data.userId = payload.sub;
      client.data.role = payload.role;

      this.logger.log(`WebSocket ulandi: ${client.id} (${payload.sub})`);
    } catch {
      this.logger.warn(`Noto'g'ri token: ${client.id}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket): void {
    // Ushbu socket bilan bog'liq barcha roomlarni tozalash
    this.ticketRooms.forEach((sockets, ticketId) => {
      sockets.delete(client.id);
      if (sockets.size === 0) this.ticketRooms.delete(ticketId);
    });
    this.logger.log(`WebSocket uzildi: ${client.id}`);
  }

  @SubscribeMessage('join_queue')
  handleJoinQueue(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { ticket_id: string },
  ): void {
    const { ticket_id } = data;
    client.join(`ticket:${ticket_id}`);

    if (!this.ticketRooms.has(ticket_id)) {
      this.ticketRooms.set(ticket_id, new Set());
    }
    this.ticketRooms.get(ticket_id)!.add(client.id);

    this.logger.log(`${client.id} → ticket:${ticket_id} roomga qo'shildi`);
  }

  @SubscribeMessage('leave_queue')
  handleLeaveQueue(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { ticket_id: string },
  ): void {
    const { ticket_id } = data;
    client.leave(`ticket:${ticket_id}`);
    this.ticketRooms.get(ticket_id)?.delete(client.id);
  }

  // Operator keyingi kishini chaqirganda
  async callTicket(
    ticketId: string,
    ticketNumber: number,
    windowNumber: number,
  ): Promise<void> {
    this.server.to(`ticket:${ticketId}`).emit('ticket_called', {
      ticket_number: ticketNumber,
      window_number: windowNumber,
      message: `${windowNumber}-oynaga o'ting`,
    });
  }

  // Navbat holati yangilanganda barcha kutayotganlarga xabar
  async broadcastQueueUpdate(queueId: string): Promise<void> {
    // Queuedagi barcha waiting ticketlarni olish va yangilash
    this.server.to(`queue:${queueId}`).emit('queue_update', {
      queue_id: queueId,
      updated_at: new Date().toISOString(),
    });
  }
}
```

---

## QISM 4 — FRONTEND (Next.js)

```typescript
// Frontend/src/lib/api.ts
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

// Singleton pattern — bir marta yaratiladi
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Token yangilash jarayoni (bir vaqtda bir marta)
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Request interceptor
api.interceptors.request.use((config: AxiosRequestConfig | any) => {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('access_token')
      : null;

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Boshqa so'rovlar refresh tugashini kutsin
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('Refresh token yo\'q');

        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refresh_token: refreshToken },
        );

        const newToken = data.data.access_token;
        localStorage.setItem('access_token', newToken);
        localStorage.setItem('refresh_token', data.data.refresh_token);

        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Xatolik xabarlari
    if (!error.response) {
      return Promise.reject(new Error('Internet aloqasi yo\'q'));
    }

    const errorMessages: Record<number, string> = {
      400: error.response.data?.error?.message || 'Noto\'g\'ri so\'rov',
      403: 'Bu amalni bajarish uchun ruxsat yo\'q',
      404: 'Ma\'lumot topilmadi',
      429: 'Ko\'p so\'rov. Biroz kutib turing',
      500: 'Server xatosi. Qayta urining',
      502: 'Server vaqtincha ishlamayapti',
      503: 'Xizmat vaqtincha mavjud emas',
    };

    const message =
      errorMessages[error.response.status] ||
      error.response.data?.error?.message ||
      'Noma\'lum xatolik';

    return Promise.reject(new Error(message));
  },
);

export default api;
```

```typescript
// Frontend/src/lib/socket.ts
import { io, Socket } from 'socket.io-client';

class SocketManager {
  private socket: Socket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;

  connect(): Socket {
    if (this.socket?.connected) return this.socket;

    const token = localStorage.getItem('access_token');

    this.socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });

    this.socket.on('connect', () => {
      console.log('[WS] Ulandi:', this.socket?.id);
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('[WS] Uzildi:', reason);
    });

    this.socket.on('connect_error', (err) => {
      console.error('[WS] Xatolik:', err.message);
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

// Global singleton
export const socketManager = new SocketManager();
export const getSocket = () => socketManager.connect();
```

---

## QISM 5 — DATABASE MIGRATIONS

```typescript
// Backend/src/database/migrations/1700000001-CreateUsers.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1700000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ENUM type yaratish
    await queryRunner.query(`
      CREATE TYPE user_role AS ENUM (
        'citizen', 'operator', 'admin', 'superadmin'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE users (
        id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        phone        VARCHAR(13) UNIQUE NOT NULL,
        full_name    VARCHAR(100) NOT NULL DEFAULT '',
        passport_series VARCHAR(9),
        birth_date   DATE,
        role         user_role NOT NULL DEFAULT 'citizen',
        is_active    BOOLEAN NOT NULL DEFAULT true,
        created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    // Index — telefon raqam bo'yicha tez qidirish
    await queryRunner.query(`
      CREATE INDEX idx_users_phone ON users(phone)
    `);

    // Trigger — updated_at avtomatik yangilansin
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
      $$ LANGUAGE plpgsql
    `);

    await queryRunner.query(`
      CREATE TRIGGER users_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW EXECUTE FUNCTION update_updated_at()
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS users`);
    await queryRunner.query(`DROP TYPE IF EXISTS user_role`);
  }
}
```

```typescript
// Backend/src/database/migrations/1700000005-CreateTickets.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTickets1700000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE ticket_status AS ENUM (
        'waiting', 'called', 'in_progress',
        'completed', 'skipped', 'cancelled'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE tickets (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        queue_id      UUID NOT NULL REFERENCES queues(id) ON DELETE CASCADE,
        user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        ticket_number INT NOT NULL,
        status        ticket_status NOT NULL DEFAULT 'waiting',
        window_number INT,
        issued_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        called_at     TIMESTAMPTZ,
        completed_at  TIMESTAMPTZ
      )
    `);

    // Eng ko'p ishlatiladigan querylar uchun indexlar
    await queryRunner.query(`
      CREATE INDEX idx_tickets_queue_status
      ON tickets(queue_id, status)
    `);

    await queryRunner.query(`
      CREATE INDEX idx_tickets_user_status
      ON tickets(user_id, status)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS tickets`);
    await queryRunner.query(`DROP TYPE IF EXISTS ticket_status`);
  }
}
```

---

## QISM 6 — RAILWAY DEPLOY

```dockerfile
# Backend/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app

# package.json avval copy — Docker layer cache uchun
COPY package*.json ./
RUN npm ci --only=production=false

COPY . .
RUN npm run build

# Production image — minimal hajm
FROM node:20-alpine AS production
WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./

USER nestjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["node", "dist/main.js"]
```

```dockerfile
# Frontend/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build vaqtida env variable lar kerak (Next.js NEXT_PUBLIC_*)
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_WS_URL
ARG NEXT_PUBLIC_APP_NAME
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME

RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Standalone output — minimal hajm
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3001

ENV PORT=3001
ENV NODE_ENV=production

CMD ["node", "server.js"]
```

```toml
# Backend/railway.toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "Dockerfile"

[deploy]
startCommand = "node dist/main.js"
healthcheckPath = "/api/health"
healthcheckTimeout = 60
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 3

[environments.production]
PORT = "3000"
NODE_ENV = "production"
```

```toml
# Frontend/railway.toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "Dockerfile"

[build.args]
NEXT_PUBLIC_APP_NAME = "E-Navbat UZ"

[deploy]
startCommand = "node server.js"
healthcheckPath = "/"
healthcheckTimeout = 60
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 3
```

---

## QISM 7 — DEPLOY QADAMLARI

```bash
# 1. GitHub ga push
git init
git add .
git commit -m "feat: E-Navbat UZ initial commit"
git remote add origin https://github.com/username/enavbat.git
git push -u origin main

# 2. Railway CLI orqali (ixtiyoriy)
npm install -g @railway/cli
railway login
railway init
railway up
```

**Railway Dashboard da:**

```
1. railway.com → New Project → Deploy from GitHub

2. Canvas da qo'shing:
   + PostgreSQL  (Database)
   + Redis       (Database)
   + Backend     (GitHub repo, Root: Backend/)
   + Frontend    (GitHub repo, Root: Frontend/)

3. Backend Variables:
   DATABASE_URL  = ${{Postgres.DATABASE_URL}}
   REDIS_URL     = ${{Redis.REDIS_URL}}
   JWT_SECRET    = [32+ belgi]
   JWT_REFRESH_SECRET = [32+ belgi, boshqacha]
   CORS_ORIGIN   = https://[frontend].railway.app
   NODE_ENV      = production
   PORT          = 3000

4. Frontend Variables:
   NEXT_PUBLIC_API_URL = https://[backend].railway.app/api
   NEXT_PUBLIC_WS_URL  = wss://[backend].railway.app

5. Har ikki service → Settings → Generate Domain

6. CORS_ORIGIN ni frontend URL bilan yangilang

7. Tekshirish:
   curl https://[backend].railway.app/api/health
   → { "status": "ok" }
```

---

**Bu qo'llanmada nimalar bor:**

- Clean Architecture — Controller → Service → Repository
- JWT + Refresh Token + Redis Blacklist — professional auth
- Pessimistic Lock — parallel navbat olishda muammo yo'q
- WebSocket Singleton — xotira muammosi yo'q
- Docker multi-stage build — minimal image hajmi
- Migration — database versioning
- Rate limiting — DDoS himoya
- Global error handler — barcha xatoliklar bir formatda
- Health check — Railway monitoring uchun
Katta material bo'ladi — qismlarga bo'lib yozaman. Tayyor bo'ling!

---

# E-Navbat UZ — To'liq Loyiha Qo'llanmasi
### 15 yillik tajriba darajasida, professional tushuntirish

---

## QISM 1 — ARXITEKTURA VA TIZIM DIZAYNI

### Nega bunday arxitektura?

Professional loyihalarda birinchi savol: "Bu tizim 5 yil, 10 yil keyingi ham ishlashi kerakmi?" — javob ha bo'lsa, arxitektura eng muhim qaror.

**E-Navbat uchun muammo:**
- Bir vaqtda 10,000+ foydalanuvchi navbat olishi mumkin
- Real-time yangilanish (navbat holati sekundma-sekund)
- Har xil idoralar (davlat, xususiy, tibbiyot)
- Hukumat darajasi — xavfsizlik va ishonchlilik

**Yechim — Layered Architecture:**

```
┌─────────────────────────────────────────┐
│           CLIENT LAYER                  │
│   Mobile (iOS/Android) │ Web (Browser)  │
└──────────────┬──────────────────────────┘
               │ HTTPS + WSS
┌──────────────▼──────────────────────────┐
│           GATEWAY LAYER                 │
│   Nginx (reverse proxy, SSL, rate limit)│
└──────────────┬──────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
┌──────▼──────┐  ┌──────▼──────┐
│  Frontend   │  │   Backend   │
│  Next.js    │  │   NestJS    │
│  Port:3001  │  │  Port:3000  │
└─────────────┘  └──────┬──────┘
                        │
              ┌─────────┼──────────┐
              │         │          │
        ┌─────▼──┐ ┌────▼───┐ ┌───▼────┐
        │Postgres│ │ Redis  │ │  SMS   │
        │  :5432 │ │  :6379 │ │Gateway │
        └────────┘ └────────┘ └────────┘
```

**Har qatlamning roli:**

**Nginx** — eshik qorovuli. Tashqaridan kelgan barcha so'rovlarni qabul qiladi, SSL ni hal qiladi, keyin to'g'ri servicega yo'naltiradi. Railway da bu avtomatik.

**Next.js (Frontend)** — faqat UI ko'rsatadi. Server Side Rendering (SSR) orqali sahifalar server da render bo'ladi — bu SEO va tezlik uchun muhim.

**NestJS (Backend)** — biznes mantiq shu yerda. Navbat olish, token tekshirish, operator boshqaruvi — hammasi.

**PostgreSQL** — asosiy ma'lumotlar ombori. Foydalanuvchilar, navbatlar, tarix — doimiy saqlanadi.

**Redis** — tezkor xotira. Hozirgi navbat holati, sessionlar — RAM da saqlanadi, millisekund da javob beradi.

---

## QISM 2 — BACKEND TUZILISHI (NestJS)

### Clean Architecture — nega?

Oddiy dasturchilar kodni bir joyga yozadi. Professional dasturchilar kodni **qatlamlarga** ajratadi:

```
HTTP so'rov keldi
      │
      ▼
┌─────────────┐
│ Controller  │  ← Faqat HTTP: so'rov qabul, javob qaytarish
└──────┬──────┘
       │
┌──────▼──────┐
│   Service   │  ← Faqat biznes mantiq: qoidalar, hisob-kitob
└──────┬──────┘
       │
┌──────▼──────┐
│ Repository  │  ← Faqat database: save, find, update, delete
└──────┬──────┘
       │
┌──────▼──────┐
│  Database   │  ← PostgreSQL
└─────────────┘
```

**Nega bu muhim?**

Agar holda kelajakda PostgreSQL ni MySQL ga o'tkazmoqchi bo'lsangiz — faqat Repository qatlamini o'zgartirасиз. Controller va Service hech o'zgarmaydi. Bu 15 yillik dasturchi fikrlash tarzi.

### To'liq Backend Fayl Strukturasi:

```
Backend/
├── src/
│   ├── main.ts                    ← Dastur kirish nuqtasi
│   ├── app.module.ts              ← Root modul
│   │
│   ├── config/                    ← Konfiguratsiyalar
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   └── jwt.config.ts
│   │
│   ├── common/                    ← Umumiy utilitalar
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts   ← Global xatolik ushlagich
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts          ← JWT tekshiruvchi
│   │   │   └── roles.guard.ts             ← Rol tekshiruvchi
│   │   ├── interceptors/
│   │   │   └── response.interceptor.ts    ← Javob formatlash
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   └── pipes/
│   │       └── validation.pipe.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   └── jwt.strategy.ts
│   │   │   └── dto/
│   │   │       ├── send-otp.dto.ts
│   │   │       └── verify-otp.dto.ts
│   │   │
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.repository.ts
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-user.dto.ts
│   │   │       └── update-user.dto.ts
│   │   │
│   │   ├── organizations/
│   │   ├── services/
│   │   ├── tickets/
│   │   ├── operators/
│   │   └── notifications/
│   │       └── gateways/
│   │           └── queue.gateway.ts      ← WebSocket
│   │
│   └── database/
│       └── migrations/
│           ├── 1700000001-CreateUsers.ts
│           ├── 1700000002-CreateOrganizations.ts
│           ├── 1700000003-CreateServices.ts
│           ├── 1700000004-CreateQueues.ts
│           ├── 1700000005-CreateTickets.ts
│           └── 1700000006-CreateOperators.ts
│
├── test/
│   ├── auth.e2e-spec.ts
│   └── tickets.e2e-spec.ts
│
├── Dockerfile
├── railway.toml
├── .env.example
├── tsconfig.json
├── tsconfig.build.json
└── package.json
```

### Asosiy Backend Fayllar:

```typescript
// Backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  // Global prefix — barcha endpoint /api/ bilan boshlanadi
  app.setGlobalPrefix('api');

  // CORS — faqat ruxsat etilgan domendan so'rovlarga yo'l beriladi
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // WebSocket adapter
  app.useWebSocketAdapter(new IoAdapter(app));

  // Global validation — barcha DTO lar avtomatik tekshiriladi
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // DTO da yo'q fieldlarni o'chirib tashlaydi
      forbidNonWhitelisted: true, // Noma'lum field kelsa 400 qaytaradi
      transform: true,           // String → number avtomatik o'giradi
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global xatolik ushlagich
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global javob formatlash
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Swagger — API dokumentatsiya
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('E-Navbat UZ API')
      .setDescription('Elektron navbat olish tizimi')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'JWT-auth',
      )
      .addTag('auth', 'Autentifikatsiya')
      .addTag('tickets', 'Navbat olish')
      .addTag('organizations', 'Idoralar')
      .addTag('operators', 'Operator panel')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
    logger.log('Swagger: http://localhost:3000/api/docs');
  }

  // Health check
  app.getHttpAdapter().get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version,
    });
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); // 0.0.0.0 Railway uchun muhim
  logger.log(`Backend ishga tushdi: http://localhost:${port}`);
  logger.log(`API prefix: http://localhost:${port}/api`);
}

bootstrap();
```

```typescript
// Backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { OperatorsModule } from './modules/operators/operators.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    // Environment variables — eng avval yuklanadi
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Database ulanish
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: databaseConfig,
      inject: [ConfigService],
    }),

    // Rate limiting — DDoS himoyasi
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000,   // 1 daqiqa
        limit: 100,   // 100 so'rov
      },
      {
        name: 'long',
        ttl: 3600000, // 1 soat
        limit: 1000,  // 1000 so'rov
      },
    ]),

    // Biznes modullar
    AuthModule,
    UsersModule,
    OrganizationsModule,
    TicketsModule,
    OperatorsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
```

```typescript
// Backend/src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_ERROR';
    let message = 'Server xatosi yuz berdi';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        const res = exceptionResponse as any;
        message = res.message || message;
        code = res.code || this.getCodeByStatus(status);
      } else {
        message = exceptionResponse;
        code = this.getCodeByStatus(status);
      }
    }

    // Production da stack trace ni yashirish
    if (process.env.NODE_ENV !== 'production') {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : exception,
      );
    }

    response.status(status).json({
      success: false,
      error: {
        code,
        message: Array.isArray(message) ? message[0] : message,
        statusCode: status,
      },
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private getCodeByStatus(status: number): string {
    const codes: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'VALIDATION_ERROR',
      429: 'TOO_MANY_REQUESTS',
      500: 'INTERNAL_ERROR',
    };
    return codes[status] || 'UNKNOWN_ERROR';
  }
}
```

```typescript
// Backend/src/common/interceptors/response.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // Agar data allaqachon formatlanган bo'lsa
        if (data?.success !== undefined) return data;

        return {
          success: true,
          data: data?.data ?? data,
          message: data?.message ?? 'Muvaffaqiyatli',
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
```

```typescript
// Backend/src/modules/auth/auth.service.ts
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { User } from '../users/entities/user.entity';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly OTP_TTL = 300;      // 5 daqiqa
  private readonly OTP_LIMIT = 3;      // soatiga 3 ta
  private readonly OTP_LIMIT_TTL = 3600; // 1 soat

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async sendOtp(dto: SendOtpDto): Promise<{ message: string }> {
    const { phone } = dto;

    // Rate limit tekshirish
    const limitKey = `otp:limit:${phone}`;
    const attempts = await this.redis.incr(limitKey);

    if (attempts === 1) {
      await this.redis.expire(limitKey, this.OTP_LIMIT_TTL);
    }

    if (attempts > this.OTP_LIMIT) {
      const ttl = await this.redis.ttl(limitKey);
      throw new BadRequestException({
        code: 'OTP_LIMIT_EXCEEDED',
        message: `Ko'p urinish. ${Math.ceil(ttl / 60)} daqiqadan so'ng qayta urining`,
      });
    }

    // OTP generatsiya (production da 6 raqam, test da 111111)
    const otp =
      process.env.NODE_ENV === 'production'
        ? Math.floor(100000 + Math.random() * 900000).toString()
        : '111111';

    // Redis ga saqlash
    const otpKey = `otp:${phone}`;
    await this.redis.setex(otpKey, this.OTP_TTL, otp);

    // SMS yuborish
    await this.sendSms(phone, `E-Navbat: tasdiqlash kodi ${otp}`);

    this.logger.log(`OTP yuborildi: ${phone}`);
    return { message: 'OTP yuborildi' };
  }

  async verifyOtp(
    dto: VerifyOtpDto,
  ): Promise<{ access_token: string; refresh_token: string; user: User }> {
    const { phone, otp } = dto;

    // OTP tekshirish
    const otpKey = `otp:${phone}`;
    const savedOtp = await this.redis.get(otpKey);

    if (!savedOtp) {
      throw new BadRequestException({
        code: 'OTP_EXPIRED',
        message: 'OTP muddati tugagan, qayta so\'rang',
      });
    }

    if (savedOtp !== otp) {
      throw new BadRequestException({
        code: 'INVALID_OTP',
        message: 'Noto\'g\'ri OTP kod',
      });
    }

    // OTP ni o'chirib yuborish (bir martalik)
    await this.redis.del(otpKey);

    // Foydalanuvchi topish yoki yaratish
    let user = await this.userRepository.findOne({ where: { phone } });
    if (!user) {
      user = this.userRepository.create({ phone, full_name: phone });
      await this.userRepository.save(user);
      this.logger.log(`Yangi foydalanuvchi: ${phone}`);
    }

    // Token yaratish
    const tokens = await this.generateTokens(user);
    return { ...tokens, user };
  }

  async refresh(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    // Blacklist tekshirish
    const blacklisted = await this.redis.get(`blacklist:${refreshToken}`);
    if (blacklisted) {
      throw new UnauthorizedException({
        code: 'TOKEN_REVOKED',
        message: 'Token bekor qilingan',
      });
    }

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user || !user.is_active) {
        throw new UnauthorizedException('Foydalanuvchi topilmadi');
      }

      // Eski refresh token ni blacklist ga qo'shish
      await this.redis.setex(
        `blacklist:${refreshToken}`,
        30 * 24 * 3600,
        '1',
      );

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException({
        code: 'TOKEN_EXPIRED',
        message: 'Token muddati tugagan',
      });
    }
  }

  async logout(token: string): Promise<{ message: string }> {
    await this.redis.setex(`blacklist:${token}`, 15 * 60, '1');
    return { message: 'Muvaffaqiyatli chiqildi' };
  }

  private async generateTokens(
    user: User,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = { sub: user.id, phone: user.phone, role: user.role };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
      }),
    ]);

    return { access_token, refresh_token };
  }

  private async sendSms(phone: string, message: string): Promise<void> {
    // SMS Gateway integratsiyasi
    if (process.env.NODE_ENV !== 'production') {
      this.logger.debug(`SMS (test): ${phone} → ${message}`);
      return;
    }
    // Real SMS gateway chaqiruvi bu yerga yoziladi
    this.logger.log(`SMS yuborildi: ${phone}`);
  }
}
```

```typescript
// Backend/src/modules/tickets/tickets.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { Ticket } from './entities/ticket.entity';
import { Queue } from './entities/queue.entity';
import { QueueGateway } from '../notifications/gateways/queue.gateway';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);

  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Queue)
    private readonly queueRepository: Repository<Queue>,
    private readonly dataSource: DataSource,
    @InjectRedis() private readonly redis: Redis,
    private readonly queueGateway: QueueGateway,
  ) {}

  async create(serviceId: string, userId: string): Promise<Ticket> {
    // Transaction — ma'lumotlar yaxlitligi uchun
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Foydalanuvchida aktiv ticket bormi?
      const activeTicket = await queryRunner.manager.findOne(Ticket, {
        where: { user: { id: userId }, status: 'waiting' },
      });

      if (activeTicket) {
        throw new BadRequestException({
          code: 'TICKET_LIMIT_EXCEEDED',
          message: 'Sizda allaqachon aktiv navbat mavjud',
        });
      }

      // 2. Bugungi queue topish yoki yaratish (PESSIMISTIC LOCK)
      const today = new Date().toISOString().split('T')[0];
      let queue = await queryRunner.manager.findOne(Queue, {
        where: { service: { id: serviceId }, date: today as any },
        lock: { mode: 'pessimistic_write' }, // Parallel so'rovlar uchun
      });

      if (!queue) {
        queue = queryRunner.manager.create(Queue, {
          service: { id: serviceId },
          date: today as any,
          current_number: 0,
          total_issued: 0,
        });
        await queryRunner.manager.save(queue);
      }

      // 3. Limit tekshirish
      const service = await queryRunner.manager.findOne('Service', {
        where: { id: serviceId },
      });

      if (queue.total_issued >= (service as any).daily_limit) {
        throw new BadRequestException({
          code: 'QUEUE_FULL',
          message: 'Bugunlik navbat to\'ldi, ertaga keling',
        });
      }

      // 4. Ticket yaratish
      queue.total_issued += 1;
      await queryRunner.manager.save(queue);

      const ticket = queryRunner.manager.create(Ticket, {
        queue: { id: queue.id },
        user: { id: userId },
        ticket_number: queue.total_issued,
        status: 'waiting',
      });

      await queryRunner.manager.save(ticket);
      await queryRunner.commitTransaction();

      // 5. Redis cache yangilash
      await this.updateQueueCache(queue.id);

      // 6. WebSocket orqali barcha kutayotganlarga yangilash
      await this.queueGateway.broadcastQueueUpdate(queue.id);

      this.logger.log(
        `Ticket yaratildi: #${ticket.ticket_number} → ${userId}`,
      );

      return ticket;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getQueueStatus(serviceId: string): Promise<{
    position: number;
    waiting_count: number;
    estimated_wait: number;
  }> {
    // Redis dan tezkor o'qish
    const cacheKey = `queue:status:${serviceId}`;
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    // Cache yo'q bo'lsa DB dan o'qish
    const today = new Date().toISOString().split('T')[0];
    const queue = await this.queueRepository.findOne({
      where: { service: { id: serviceId }, date: today as any },
    });

    if (!queue) {
      return { position: 0, waiting_count: 0, estimated_wait: 0 };
    }

    const waiting_count = await this.ticketRepository.count({
      where: { queue: { id: queue.id }, status: 'waiting' },
    });

    const result = {
      position: queue.current_number,
      waiting_count,
      estimated_wait: waiting_count * 15, // har biri ~15 daqiqa
    };

    // 10 soniya cache
    await this.redis.setex(cacheKey, 10, JSON.stringify(result));
    return result;
  }

  private async updateQueueCache(queueId: string): Promise<void> {
    await this.redis.del(`queue:status:${queueId}`);
  }
}
```

---

## QISM 3 — WEBSOCKET (Real-time)

```typescript
// Backend/src/modules/notifications/gateways/queue.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
  namespace: '/',
})
export class QueueGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server;

  private readonly logger = new Logger(QueueGateway.name);

  // ticketId → Set<socketId> — qaysi socket qaysi ticketni kuzatyapti
  private readonly ticketRooms = new Map<string, Set<string>>();

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket): Promise<void> {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.split(' ')[1];

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      client.data.userId = payload.sub;
      client.data.role = payload.role;

      this.logger.log(`WebSocket ulandi: ${client.id} (${payload.sub})`);
    } catch {
      this.logger.warn(`Noto'g'ri token: ${client.id}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket): void {
    // Ushbu socket bilan bog'liq barcha roomlarni tozalash
    this.ticketRooms.forEach((sockets, ticketId) => {
      sockets.delete(client.id);
      if (sockets.size === 0) this.ticketRooms.delete(ticketId);
    });
    this.logger.log(`WebSocket uzildi: ${client.id}`);
  }

  @SubscribeMessage('join_queue')
  handleJoinQueue(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { ticket_id: string },
  ): void {
    const { ticket_id } = data;
    client.join(`ticket:${ticket_id}`);

    if (!this.ticketRooms.has(ticket_id)) {
      this.ticketRooms.set(ticket_id, new Set());
    }
    this.ticketRooms.get(ticket_id)!.add(client.id);

    this.logger.log(`${client.id} → ticket:${ticket_id} roomga qo'shildi`);
  }

  @SubscribeMessage('leave_queue')
  handleLeaveQueue(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { ticket_id: string },
  ): void {
    const { ticket_id } = data;
    client.leave(`ticket:${ticket_id}`);
    this.ticketRooms.get(ticket_id)?.delete(client.id);
  }

  // Operator keyingi kishini chaqirganda
  async callTicket(
    ticketId: string,
    ticketNumber: number,
    windowNumber: number,
  ): Promise<void> {
    this.server.to(`ticket:${ticketId}`).emit('ticket_called', {
      ticket_number: ticketNumber,
      window_number: windowNumber,
      message: `${windowNumber}-oynaga o'ting`,
    });
  }

  // Navbat holati yangilanganda barcha kutayotganlarga xabar
  async broadcastQueueUpdate(queueId: string): Promise<void> {
    // Queuedagi barcha waiting ticketlarni olish va yangilash
    this.server.to(`queue:${queueId}`).emit('queue_update', {
      queue_id: queueId,
      updated_at: new Date().toISOString(),
    });
  }
}
```

---

## QISM 4 — FRONTEND (Next.js)

```typescript
// Frontend/src/lib/api.ts
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

// Singleton pattern — bir marta yaratiladi
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Token yangilash jarayoni (bir vaqtda bir marta)
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Request interceptor
api.interceptors.request.use((config: AxiosRequestConfig | any) => {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('access_token')
      : null;

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Boshqa so'rovlar refresh tugashini kutsin
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('Refresh token yo\'q');

        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refresh_token: refreshToken },
        );

        const newToken = data.data.access_token;
        localStorage.setItem('access_token', newToken);
        localStorage.setItem('refresh_token', data.data.refresh_token);

        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Xatolik xabarlari
    if (!error.response) {
      return Promise.reject(new Error('Internet aloqasi yo\'q'));
    }

    const errorMessages: Record<number, string> = {
      400: error.response.data?.error?.message || 'Noto\'g\'ri so\'rov',
      403: 'Bu amalni bajarish uchun ruxsat yo\'q',
      404: 'Ma\'lumot topilmadi',
      429: 'Ko\'p so\'rov. Biroz kutib turing',
      500: 'Server xatosi. Qayta urining',
      502: 'Server vaqtincha ishlamayapti',
      503: 'Xizmat vaqtincha mavjud emas',
    };

    const message =
      errorMessages[error.response.status] ||
      error.response.data?.error?.message ||
      'Noma\'lum xatolik';

    return Promise.reject(new Error(message));
  },
);

export default api;
```

```typescript
// Frontend/src/lib/socket.ts
import { io, Socket } from 'socket.io-client';

class SocketManager {
  private socket: Socket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;

  connect(): Socket {
    if (this.socket?.connected) return this.socket;

    const token = localStorage.getItem('access_token');

    this.socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });

    this.socket.on('connect', () => {
      console.log('[WS] Ulandi:', this.socket?.id);
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('[WS] Uzildi:', reason);
    });

    this.socket.on('connect_error', (err) => {
      console.error('[WS] Xatolik:', err.message);
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

// Global singleton
export const socketManager = new SocketManager();
export const getSocket = () => socketManager.connect();
```

---

## QISM 5 — DATABASE MIGRATIONS

```typescript
// Backend/src/database/migrations/1700000001-CreateUsers.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1700000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ENUM type yaratish
    await queryRunner.query(`
      CREATE TYPE user_role AS ENUM (
        'citizen', 'operator', 'admin', 'superadmin'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE users (
        id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        phone        VARCHAR(13) UNIQUE NOT NULL,
        full_name    VARCHAR(100) NOT NULL DEFAULT '',
        passport_series VARCHAR(9),
        birth_date   DATE,
        role         user_role NOT NULL DEFAULT 'citizen',
        is_active    BOOLEAN NOT NULL DEFAULT true,
        created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    // Index — telefon raqam bo'yicha tez qidirish
    await queryRunner.query(`
      CREATE INDEX idx_users_phone ON users(phone)
    `);

    // Trigger — updated_at avtomatik yangilansin
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
      $$ LANGUAGE plpgsql
    `);

    await queryRunner.query(`
      CREATE TRIGGER users_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW EXECUTE FUNCTION update_updated_at()
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS users`);
    await queryRunner.query(`DROP TYPE IF EXISTS user_role`);
  }
}
```

```typescript
// Backend/src/database/migrations/1700000005-CreateTickets.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTickets1700000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE ticket_status AS ENUM (
        'waiting', 'called', 'in_progress',
        'completed', 'skipped', 'cancelled'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE tickets (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        queue_id      UUID NOT NULL REFERENCES queues(id) ON DELETE CASCADE,
        user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        ticket_number INT NOT NULL,
        status        ticket_status NOT NULL DEFAULT 'waiting',
        window_number INT,
        issued_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        called_at     TIMESTAMPTZ,
        completed_at  TIMESTAMPTZ
      )
    `);

    // Eng ko'p ishlatiladigan querylar uchun indexlar
    await queryRunner.query(`
      CREATE INDEX idx_tickets_queue_status
      ON tickets(queue_id, status)
    `);

    await queryRunner.query(`
      CREATE INDEX idx_tickets_user_status
      ON tickets(user_id, status)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS tickets`);
    await queryRunner.query(`DROP TYPE IF EXISTS ticket_status`);
  }
}
```

---

## QISM 6 — RAILWAY DEPLOY

```dockerfile
# Backend/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app

# package.json avval copy — Docker layer cache uchun
COPY package*.json ./
RUN npm ci --only=production=false

COPY . .
RUN npm run build

# Production image — minimal hajm
FROM node:20-alpine AS production
WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./

USER nestjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["node", "dist/main.js"]
```

```dockerfile
# Frontend/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build vaqtida env variable lar kerak (Next.js NEXT_PUBLIC_*)
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_WS_URL
ARG NEXT_PUBLIC_APP_NAME
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME

RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Standalone output — minimal hajm
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3001

ENV PORT=3001
ENV NODE_ENV=production

CMD ["node", "server.js"]
```

```toml
# Backend/railway.toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "Dockerfile"

[deploy]
startCommand = "node dist/main.js"
healthcheckPath = "/api/health"
healthcheckTimeout = 60
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 3

[environments.production]
PORT = "3000"
NODE_ENV = "production"
```

```toml
# Frontend/railway.toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "Dockerfile"

[build.args]
NEXT_PUBLIC_APP_NAME = "E-Navbat UZ"

[deploy]
startCommand = "node server.js"
healthcheckPath = "/"
healthcheckTimeout = 60
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 3
```

---

## QISM 7 — DEPLOY QADAMLARI

```bash
# 1. GitHub ga push
git init
git add .
git commit -m "feat: E-Navbat UZ initial commit"
git remote add origin https://github.com/username/enavbat.git
git push -u origin main

# 2. Railway CLI orqali (ixtiyoriy)
npm install -g @railway/cli
railway login
railway init
railway up
```

**Railway Dashboard da:**

```
1. railway.com → New Project → Deploy from GitHub

2. Canvas da qo'shing:
   + PostgreSQL  (Database)
   + Redis       (Database)
   + Backend     (GitHub repo, Root: Backend/)
   + Frontend    (GitHub repo, Root: Frontend/)

3. Backend Variables:
   DATABASE_URL  = ${{Postgres.DATABASE_URL}}
   REDIS_URL     = ${{Redis.REDIS_URL}}
   JWT_SECRET    = [32+ belgi]
   JWT_REFRESH_SECRET = [32+ belgi, boshqacha]
   CORS_ORIGIN   = https://[frontend].railway.app
   NODE_ENV      = production
   PORT          = 3000

4. Frontend Variables:
   NEXT_PUBLIC_API_URL = https://[backend].railway.app/api
   NEXT_PUBLIC_WS_URL  = wss://[backend].railway.app

5. Har ikki service → Settings → Generate Domain

6. CORS_ORIGIN ni frontend URL bilan yangilang

7. Tekshirish:
   curl https://[backend].railway.app/api/health
   → { "status": "ok" }
```

---

**Bu qo'llanmada nimalar bor:**

- Clean Architecture — Controller → Service → Repository
- JWT + Refresh Token + Redis Blacklist — professional auth
- Pessimistic Lock — parallel navbat olishda muammo yo'q
- WebSocket Singleton — xotira muammosi yo'q
- Docker multi-stage build — minimal image hajmi
- Migration — database versioning
- Rate limiting — DDoS himoya
- Global error handler — barcha xatoliklar bir formatda
- Health check — Railway monitoring uchun
PostgreSQL
.env shular bor railway dan
PORT="5000"
JWT_SECRET="navbat_uz_maxfiy_kalit_2026"
CLIENT_URL="https://loyiha-nav-production.up.railway.app/"
NODE_ENV="development"

PGDATA= /var/lib/postgresql/data/pgdata
PGDATABASE=railway
PGHOST=postgres.railway.internal
PGPASSWORD=MFLGPFnWEDsTxFeXXfZYdlIQooOWiSOo
PGPORT=5432
PGUSER=postgres
POSTGRES_DB=railway
POSTGRES_PASSWORD=MFLGPFnWEDsTxFeXXfZYdlIQooOWiSOo
POSTGRES_USER=postgres
RAILWAY_DEPLOYMENT_DRAINING_SECONDS=60
SSL_CERT_DAYS=820
DATABASE_URL=postgresql://postgres:MFLGPFnWEDsTxFeXXfZYdlIQooOWiSOo@postgres.railway.internal:5432/railway
DATABASE_PUBLIC_URL=postgresql://postgres:MFLGPFnWEDsTxFeXXfZYdlIQooOWiSOo@junction.proxy.rlwy.net:55512/railway