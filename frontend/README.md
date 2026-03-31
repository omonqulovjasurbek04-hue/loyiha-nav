# Loyiha — React + Vite + Tailwind CSS

## 📋 Talablar (Prerequisites)

Loyihani ishga tushirishdan oldin quyidagilar o'rnatilgan bo'lishi kerak:

- **Node.js** (v18 yoki undan yuqori) — [yuklab olish](https://nodejs.org/)
- **npm** (Node.js bilan birga keladi) yoki **yarn**
- **Git** — [yuklab olish](https://git-scm.com/)

Tekshirish:

```bash
node -v
npm -v
git --version
```

---

## 🚀 O'rnatish va Ishga Tushirish

### 1. Repozitoriyani klonlash

```bash
git clone <repository-url>
cd Loyiha
```

### 2. Dependensiyalarni o'rnatish

```bash
npm install
```

### 3. Development serverni ishga tushirish

```bash
npm run dev
```

Server ishga tushgandan so'ng, terminal sizga manzilni ko'rsatadi, odatda:

```
http://localhost:5173
```

Brauzerda shu manzilni oching — loyiha ishga tushadi! 🎉

---

## 📦 Boshqa Buyruqlar

| Buyruq              | Tavsif                                           |
| ------------------- | ------------------------------------------------ |
| `npm run dev`       | Development serverni ishga tushiradi (HMR bilan) |
| `npm run build`     | Production uchun build qiladi (`dist/` papkaga)  |
| `npm run preview`   | Build qilingan versiyani ko'rish                 |
| `npm run lint`      | ESLint bilan kodni tekshiradi                    |

---

## 🛠 Texnologiyalar

- **React** v19 — UI kutubxonasi
- **Vite** v8 — Tezkor build tool
- **Tailwind CSS** v4 — Utility-first CSS framework
- **React Router DOM** v7 — Sahifalar navigatsiyasi
- **Axios** — HTTP so'rovlar uchun
- **Socket.IO Client** — Real-time aloqa
- **Lucide React** — Ikonkalar kutubxonasi

---

## 📁 Loyiha Tuzilishi

```
Loyiha/
├── public/             # Statik fayllar
├── src/
│   ├── assets/         # Rasmlar, shriftlar va boshqa resurslar
│   ├── components/     # Qayta ishlatiladigan komponentlar
│   ├── pages/          # Sahifa komponentlari
│   ├── utils/          # Yordamchi funksiyalar (api.js va boshqalar)
│   ├── App.jsx         # Asosiy App komponenti
│   ├── main.jsx        # Kirish nuqtasi
│   └── index.css       # Global CSS (Tailwind importlari)
├── backend/            # Backend (Node.js)
├── package.json        # Dependensiyalar va skriptlar
├── vite.config.js      # Vite konfiguratsiyasi
└── README.md
```

---

## 🔧 Backend Serverni Ishga Tushirish

Agar backend ham mavjud bo'lsa:

```bash
cd backend
npm install
npm run dev
```

> **Eslatma:** Frontend va Backend serverlarni alohida terminal oynalarida ishga tushiring.

---

## 🌐 Production Build

Loyihani production uchun tayyorlash:

```bash
npm run build
```

Build natijasi `dist/` papkasida hosil bo'ladi. Uni istalgan statik hosting xizmatiga deploy qilish mumkin (Vercel, Netlify, va h.k.).

Build qilingan versiyani lokal ko'rish:

```bash
npm run preview
```
