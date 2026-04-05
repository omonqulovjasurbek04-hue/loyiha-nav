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
  <img src="https://img.shields.io/badge/Deploy-Railway-purple?logo=railway" />
  <img src="https://img.shields.io/badge/License-MIT-yellow" />
</p>

---

## 📋 Mundarija

- [Loyiha haqida](#-loyiha-haqida)
- [Texnologiyalar](#-texnologiyalar)
- [Arxitektura va Tizim Ishlashi](#-arxitektura-va-tizim-ishlashi)
- [O'rnatish (Installation)](#-ornatish-installation)
- [Railway'ga Yuklash (Deploy)](#-railwayga-yuklash-deploy)
- [Docker bilan ishga tushirish](#-docker-bilan-ishga-tushirish)
- [Loyiha strukturasi](#-loyiha-strukturasi)
- [API Endpointlar](#-api-endpointlar)
- [Xavfsizlik](#-xavfsizlik)
- [Test qilish](#-test-qilish)
- [Xatolarni bartaraf etish](#-xatolarni-bartaraf-etish)
- [Kelajak rejalari](#-kelajak-rejalari)
- [Litsenziya](#-litsenziya)

---

## 🎯 Loyiha haqida

**Navbat.uz** — tashkilotlarda (bank, shifoxona, davlat idoralari) onlayn navbat olish va boshqarish uchun yaratilgan to'liq stack veb-platforma. Tizim an'anaviy qog'ozli va vaqt oluvchi jarayonlarni zamonaviy elektron ko'rinishga (Raqamlashtirish) o'tkazish vazifasini bajaradi.

### Asosiy imkoniyatlar:
- 🏢 **Tashkilotlar ro'yxati** — bank, shifoxona, hokimiyat va boshqa kategoriyalarni qo'shish va filiallargacha tahlil qilish.
- 🎫 **Onlayn navbat olish** — internet orqali xohlagan joydan bitta tugma bilan xizmatni band qilish.
- 📊 **Real-vaqt kuzatish** — WebSocket kuchi orqali kim, qachon, qaysi raqamda uchrashuvga kirishi kabi jonli efir taqdim etilishi.
- 👨💼 **Operator paneli** — navbatlarni chaqirish, xizmat ko'rsatilganlarni saqlab qolish, bekor qilish imkoniyati.
- 📺 **Zal ekrani (Display Board)** — yopiq majlislar yohud keng zallardagi TV/monitorlar orqali chaqiriq raqamini hammaga ko'rsatish funksiyasi.
- 🛡️ **Admin paneli** — tizimdagi barcha statik va dinamik o'zgarishlarni boshqaruvchi bosh markaz.
- 🔐 **Xavfsizlik tizimi** — JWT tranzaksiyalari asosida ishlovchi himoyalangan maxfiy tunnellar.

### Foydalanuvchi rollari:

| Rol | Imkoniyatlar (Huquqlar) |
|-----|-------------|
| **Mijoz** | Ro'yxatdan o'tish, uydan turib navbat olish, jonli navbat siljishini kuzatib borish |
| **Operator** | Mijozni qabul qilish, keyingi mijozni "chaqirish" ovozi bilan TV orqali chaqirish, navbat holatini "Bajarildi" yoki "To'xtatildi" qilish |
| **Admin** | Tizim parametrlari, MySQL ma'lumotlar zaxirasi, filiallar(tashkilotlar)ni biriktirish hamda umumboshqaruv |
| **Display** | Zaldagi Monitor uchun mo'ljallangan maxsus ko'rinish ro'li |

---

## 🛠 Texnologiyalar

Quyida ilovaning asosi bo'lib xizmat qilgan texnologik stak (MERN -> MySQL):

| Qatlam (Layer) | Texnologiya |
|------|-------------|
| **Frontend UI** | React 19, Vite 8, TailwindCSS 4, React Router 7 |
| **Backend API** | Node.js (v20), Express 5 |
| **Ma'lumotlar bazasi** | MySQL (Sequelize ORM orqali Relational Data Entity) |
| **Real-Vaqt aloqasi**| Socket.IO (WebSocket v4) |
| **Autentifikatsiya** | JSON Web Tokens (JWT), Bcrypt Password Hashing |
| **Ikonkalar** | Lucide React |
| **Infratuzilma** | Docker, Nginx (frontend routing), Railway.app |

---

## 🏗 Arxitektura va Tizim Ishlashi

Tizim ishlash jarayonining umumiy ko'rinishi **(Mermaid Diagram)**:

```mermaid
graph TD;
    Client[Foydalanuvchi/Brouzer] -->|HTTPS REST API| API(Express.js API);
    Client <-->|WebSocket| Socket(Socket.IO Server);
    API -->|Sequelize ORM| DB[(MySQL Database)];
    Socket -->|Real-Time Triggers| API;
    API -->|Deploy Service| Railway[Railway.app Server];
```

Ilova **Yagona Konteyner arxitekturasida** qurilgan. Frontend kompyuterda alohida ishlagani bilan, ommaga yuklanganda(Production) u **Nginx** yoki **Express**'ning o'zi orqali bitta `/api` domenida "Single Page Application" sifatda tarqatiladi.

---

## 📥 O'rnatish (Installation)

### 1-qadam: Resursni yuklab olish
```bash
git clone https://github.com/omonqulovjasurbek04-hue/loyiha-nav.git
cd loyiha-nav
```

### 2-qadam: Paketlarni o'rnatish
```bash
# Backend uchun
cd backend
npm install

# Frontend uchun
cd ../frontend
npm install
```

### 3-qadam: Muhit parametrlari (Environment Variables)
`backend` papkasi ichida `.env` qiling:
```env
PORT=5000
MYSQL_URL=mysql://root:root@localhost:3306/queue_system
JWT_SECRET=super_maxfiy_kalit_2026
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

> **Avtomatizatsiya Izohi:** Tizim ishga tushganda `Sequelize` o'zi barcha User, Organization va Queue jadvallarini UUID va Forein Key munosabatlari orqali baza ichida yaratadi. Boshqa hech nima qilish shart emas!

### 4-qadam: Ishini sinab ko'rish
Dastlab Backend terminalda ishga tushiriladi:
```bash
cd backend
npm run dev
```

Keyin Frontend boshqa terminalda yondiriladi:
```bash
cd frontend
npm run dev
```

Shundan so'ng tizim to'liq holatda **`http://localhost:5173`** manzilida kutilganidek ishlaydi.

---

## ☁️ Railway'ga Yuklash (Deploy)

Ushbu Tizim to'g'ridan to'g'ri **Railway.app** bulutli xizmatida ishlab chiqarishga (Production) yo'naltirilgan.

1. **GitHub ulanishi:** Tizim githubga yuklanadi va web asboblar paneli orqali Railway'ga Deploy yuboriladi.
2. **Data Baza yondirilishi:** Railway plaginlari orasidan "MySQL Database" qo'shilib, uning `MYSQL_URL` URL i nusxalanadi.
3. **Variables kiritilishi:** Railway.app > Web loyihangiz > Variables bo'limiga kirib quyidagilar ta'minlanadi:
   - `MYSQL_URL` = (MySQL xizmatidan olingan to'liq manzil)
   - `CLIENT_URL` = (Sizning ochiq Railway domeningiz misol uchun `https://navbat-uz.up.railway.app`)
   - `JWT_SECRET` = (Parol yasaluvchi so'z)
   - `NODE_ENV` = `production`
4. Shundan so'ng u o'zi `Dockerfile` arxitekturasini taniydi hamda React kodlarini build qilib uzluksiz tarmoqqa uzatadi!

---

## 🐳 Docker bilan ishga tushirish (Offline-Prod)

O'z serveringizda hech nima o'rnatmasdan ishga tushirish uchun, Loyiha root jildida `docker-compose.yml` ishlatiladi:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: my_secure_password
      MYSQL_DATABASE: queue_system
    ports:
      - "3306:3306"
      
  backend:
    build: 
      context: .
      dockerfile: Dockerfile
    restart: always
    environment:
      PORT: 5000
      MYSQL_URL: mysql://root:my_secure_password@mysql:3306/queue_system
      NODE_ENV: production
    ports:
      - "5000:5000"
      - "80:80"
```
```bash
# Faol holda ko'tarish
docker-compose up -d
```

---

## 📁 Loyiha strukturasi (Batafsil)

```
loyiha-nav/
├── backend/                    
│   ├── config/
│   │   └── db.js               # MySQL (Sequelize) xavfsiz Catch fallback bilan
│   ├── middleware/
│   │   └── auth.js             # JWT ni header orqali Decode qiluvchi mexanizm
│   ├── models/
│   │   ├── index.js            # Sequelize munosabatlar (Relationships) ulagichi
│   │   ├── User.js             # UUID primary key bilan mijoz tuzilmasi
│   │   ├── Organization.js     
│   │   └── Queue.js            
│   ├── routes/
│   │   ├── auth.js             # Parolni Hesh(Bcrypt)lab beruvchi uzellar
│   │   ├── organizations.js    # Shular qatorida backend native HTML form ham mavjud! (/add-form)
│   │   └── queues.js           
│   └── server.js               # Backend markaziy Express server (REST+Websocket)
│
├── frontend/                   
│   ├── index.html              # HTML DOM qutisi
│   ├── src/
│   │   ├── components/         # Takrorlanuvchi Button va Animatsiyali Form komponentlari
│   │   ├── pages/              
│   │   │   ├── admin/          # Admin boshqaruv logikasi
│   │   │   ├── operator/       # Chaqiriq (Call Next) ovozlar logikasi shu yerda 
│   │   │   └── display/        
│   │   ├── utils/
│   │   │   ├── api.js          # Axios Interceptors bilan JWT Header generatsiyasi
│   │   │   └── socket.js       # Auto-reconnection bilan Realtime Socket instance
│   │   ├── App.jsx             # React Router v6 Sahifa konveeri
│   │   └── main.jsx            # Ilova injektor 
│   └── vite.config.js          
│
├── Dockerfile                  # React Ni Build qilib Express ichiga joylovchi Multistage qadam!
└── README.md
```

---

## 🔌 API Endpointlar

Bu yerda Postman, Thunder Client yoki oddiy fetch amaliyotlari uchun Endpoint lar ko'rinishi aks etgan:

| Turi | Endpoint | Vazifasi | Himoya Turi |
|-------|----------|--------|--------|
| `POST` | `/api/auth/register` | Tizimga ro'yxatdan o'tkazish | Ochiq |
| `POST` | `/api/auth/login` | Tizimga profilga kirish (JWT token beradi)| Ochiq |
| `GET`  | `/api/organizations` | Tashkilotlarni o'qish | Ochiq |
| `GET`  | `/api/organizations/add-form` | **HTML Native Backend Form** | Ochiq |
| `POST` | `/api/organizations` | Yangi tashkilot uzatish | Ochiq |
| `POST` | `/api/queues/book` | Yangi navbat raqami olish | 🔐 Auth (Bearer) |
| `GET`  | `/api/queues/my` | Foydalanuvchining shaxsiy tarixlari| 🔐 Auth (Bearer) |
| `PUT`  | `/api/queues/:id/status`| Holat o'zgartirish (masalan done/passed)| 🔐 Auth (Op) |
| `GET`  | `/api/health` | Tizimni avariyalarga tekshirish | Ochiq |

---

## 📡 WebSocket Eventlar (Realtime Tizimi)

Dastur asabni buzadigan Refresh (Sahifani qayta yangilash) amaliyotisiz to'laqonli Socket.IO protokolida ishlaydi:

- **`join_org`**: (Xonaga ulanish) Operator yoki ko'rish paneli ekranga chiqqanda mos orgId signal yuborib izolyatsiyalanadi.
- **`call_next`**: Operator keyingi foydalanuvchini chaqirgan vaqt o'zi ham xabar tarqatadi ham display bord da "Chaqiriq!" ovozini chaldi.
- **`queue_updated`**: Kimdir navbat olsa yoki status o'zgarsa tarqaluvchi markaziy Global Event!

---

## 🔒 Xavfsizlik Va Optimizatsiya

Loyihada quyidagi xavfsizlik va tezlik choralari belgilab o'tilgan:
- **Maxfiy Parollar:** `.env` fayllari Git ignordan o'tqazilib xakerlik buzib kirishlari bartaraf yetilgan. Parollar bazaga Ochiq matnda emas `bcryptjs` aralashuvida shifrlab joylangan.
- **Single Source API (Optimal!):** Frontend ma'lumotlarni so'rashda asossiz 127.0.0.1 (CORS errorlar olib keluvchi manzillar) ni emas, balki Docker konteyner ishga tushganda o'zining mutloq ichki yo'lagi — `/api` dan foydalanadigan qilib Optimallashtirilgan.
- **Sequelize Fallback:** `db.js` fayli `MYSQL_URL` taqdim etilmagan vaqtlarda serverni vahima bilan qulatib yubormasligi (Crash qilmaydi) uchun extiyotkor xato beruvchi Maxsus himoya panjarasi bilan yozilgan!

---

## 🚀 Kelajak rejalari

Ushbu kuchli poydevor asosida yana bir qator zo'r funksiyalar kutmoqda:
- [ ] 📱 **SMS xabarnoma** — Navbat kelyotganini Telegram Bot, Eskiz.uz yoki PlayMobile SMS lari bilan sezintirish!
- [ ] 📈 **Admin Statistikalari** — Maxsus "Recharts" jadvallari va Dashboard analitika qismi.
- [ ] 🌍 **Til paketlari (i18n)** — Foydalanuvchilar o'rtasida Rus (Ru) hamda Ingles (En) til paketlari almashtirish.
- [ ] 🖨️ **Kvitansiya chiptalari** — Infokiosk kabi printerlarga ulanadigan PDF ticket generatsiyalari.

---

## 🤝 Hissa qo'shish (Contributing)

Ushbu Open-Source (oliy o'quv yurtlari amaliyotlari va tijoriy erkinlik uchun yozilgan) loyihada sizning ishtirokingizni xush ko'ramiz!

```bash
# 1. Klonlang yoki Fork qiling
# 2. Yangi qismlar qoshib commit qiling
git add .
git commit -m "feat(module): Mening qoshgan kodim"
# 3. Pull Request hosil qiling
```

---

<p align="center">
  <strong>Navbat.uz</strong> — Ishingiz bitmasa ham navbatingiz tezroq yetsin! ⏱️<br/>
  Jasurbek Omonqulov — 2026 🚀
</p>

<p align="center">
  <a href="https://github.com/omonqulovjasurbek04-hue/loyiha-nav">GitHub</a> •
  <a href="mailto:omonqulovjasurbek04@gmail.com">Bog'lanish</a> •
  <a href="https://navbat-uz.up.railway.app">Saytni Ko'rish (Live preview)</a>
</p>


