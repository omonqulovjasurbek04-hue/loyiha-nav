# Loyiha ildizidan bitta image: frontend build + Express (API + SPA bir portda)
# Build:  docker build -t loyiha .
# Ishga:   docker run -p 5000:5000 -e MONGODB_URI=... -e JWT_SECRET=... loyiha

FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
# Bir konteynerda API bilan bir origin — /api va WebSocket shu hostda
ENV VITE_API_URL=/api
ENV VITE_SOCKET_URL=
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --omit=dev
COPY backend/ ./
COPY --from=frontend-build /app/dist ./public
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "server.js"]
