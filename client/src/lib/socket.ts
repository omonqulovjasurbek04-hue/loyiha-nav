import { io, Socket } from "socket.io-client";

class SocketManager {
  private socket: Socket | null = null;

  connect(): Socket | null {
    if (this.socket?.connected) return this.socket;

    if (typeof window === "undefined") return null;

    const token = localStorage.getItem("access_token");

    this.socket = io(process.env.NEXT_PUBLIC_WS_URL || "/", {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });

    this.socket.on("connect", () => {
      console.log("[WS] Ulandi:", this.socket?.id);
    });

    this.socket.on("disconnect", (reason) => {
      console.warn("[WS] Uzildi:", reason);
    });

    this.socket.on("connect_error", (err) => {
      console.error("[WS] Xatolik:", err.message);
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

export const socketManager = new SocketManager();
export const getSocket = () => socketManager.connect();
