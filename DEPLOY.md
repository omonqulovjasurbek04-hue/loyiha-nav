# 🚢 Railway Deploy Qo'llanma

## Tayyorgarlik

```bash
git add .
git commit -m "feat: Railway deploy tayyor"
git push origin main
```

---

## Qadam-baqadam

### 1. Railway da Project Yaratish

[railway.com](https://railway.com) → **New Project** → **Deploy from GitHub repo** → `loyiha-nav`

### 2. Database Qo'shish

Canvas da **+ New**:
1. **Database** → **Add PostgreSQL**
2. **+ New** → **Database** → **Add Redis**

### 3. App Service

1. **+ New** → **GitHub Repo** → `loyiha-nav`
2. **Root Directory** — bo'sh qoldiring (root papka)

### 4. Variables

**Variables** bo'limida:

| Variable | Qiymat |
|----------|--------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` |
| `REDIS_URL` | `${{Redis.REDIS_URL}}` |
| `JWT_SECRET` | (32+ belgi, 🔒 Secret) |
| `JWT_REFRESH_SECRET` | (32+ belgi, 🔒 Secret) |
| `JWT_EXPIRES_IN` | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | `30d` |
| `CORS_ORIGIN` | `https://frontend-domain.up.railway.app` |
| `SMS_SENDER` | `E-NAVBAT` |

### 5. Domain

1. Service → **Settings** → **Networking** → **Generate Domain**
2. Domain ni nusxalab `CORS_ORIGIN` ga qo'ying
3. **Redeploy** qiling

---

## Tekshirish

```bash
curl https://backend-xxx.up.railway.app/api/health
```

```json
{ "status": "ok", "timestamp": "...", "environment": "production" }
```

---

## ⚠️ Muhim

- `JWT_SECRET` va `JWT_REFRESH_SECRET` ni **Secrets** bo'limidan kiriting
- Hech qachon `.env` ni git ga push qilmang
- Frontend alohida deploy qilish kerak bo'lsa, `client/` papkasini alohida service sifatida qo'shing
