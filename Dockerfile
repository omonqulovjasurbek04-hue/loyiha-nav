# ============================================================
# E-Navbat UZ — Monorepo Dockerfile
# ============================================================

# ───────────── BUILD STAGE ─────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Barcha dependencies bir marta
COPY package*.json ./
RUN npm ci

# Server source
COPY server/ server/
COPY tsconfig.json ./
COPY nest-cli.json ./

# Server build
RUN npm run server:build

# Client source
COPY client/ client/
COPY postcss.config.mjs ./

ARG NEXT_PUBLIC_API_URL=http://localhost:5000/api
ARG NEXT_PUBLIC_WS_URL=ws://localhost:5000
ARG NEXT_PUBLIC_APP_NAME=E-Navbat UZ

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME

RUN npm run client:build

# ───────────── PRODUCTION STAGE ─────────────
FROM node:20-alpine AS production
WORKDIR /app

RUN apk add --no-cache tini

# Backend
COPY --from=builder /app/server/dist ./backend/dist
COPY --from=builder /app/node_modules ./node_modules

# Frontend
COPY --from=builder /app/client/.next/standalone ./frontend
COPY --from=builder /app/client/.next/static ./frontend/.next/static
COPY --from=builder /app/client/public ./frontend/public

# Entrypoint
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 5000 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

ENTRYPOINT ["./entrypoint.sh"]
