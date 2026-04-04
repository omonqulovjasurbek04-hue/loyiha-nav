# Loyiha ildizidan (../frontend emas — loyiha root): docker build -f frontend/Dockerfile -t loyiha-frontend ./frontend
#
# 1. Build (React + Vite) — Railway uchun VITE_* build vaqtida beriladi
FROM node:20-alpine AS builder

WORKDIR /app

ARG VITE_API_URL=http://localhost:5000/api
ARG VITE_SOCKET_URL=http://localhost:5000
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# 2. Production — rasmiy nginx image envsubst orqali ${PORT} ni ishlatadi
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template

ENV PORT=80
EXPOSE 80
