#!/bin/sh
set -e

echo "▶ Backend ishga tushmoqda (port 5000)..."
cd /app/backend
node dist/main.js &
BACKEND_PID=$!

echo "▶ Frontend ishga tushmoqda (port 3000)..."
cd /app/frontend
PORT=3000 node server.js &
FRONTEND_PID=$!

echo "✅ Backend PID: $BACKEND_PID | Frontend PID: $FRONTEND_PID"
echo "🌐 Backend:  http://localhost:5000"
echo "🌐 Frontend: http://localhost:3000"

trap "kill $BACKEND_PID $FRONTEND_PID; exit 0" SIGTERM SIGINT

wait -n
exit $?
