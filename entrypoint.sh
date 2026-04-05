#!/bin/sh
set -e

echo "▶ Backend ishga tushmoqda (port 5000)..."
cd /app/backend
PORT=5000 node dist/main.js &
BACKEND_PID=$!

echo "▶ Frontend ishga tushmoqda (port 3000)..."
cd /app/frontend/client
PORT=3000 node server.js &
FRONTEND_PID=$!

echo "▶ Caddy Reverse Proxy ishga tushmoqda..."
cd /app
caddy run --config Caddyfile &
CADDY_PID=$!

echo "✅ Backend: $BACKEND_PID | Frontend: $FRONTEND_PID | Caddy: $CADDY_PID"
echo "🌐 API and WS routed to 5000, App to 3000 via Caddy Proxy"

trap "kill $BACKEND_PID $FRONTEND_PID $CADDY_PID; exit 0" SIGTERM SIGINT

wait -n
exit $?
