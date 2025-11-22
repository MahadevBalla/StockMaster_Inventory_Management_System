// frontend/src/services/socketService.ts
import type { Socket } from "socket.io-client";
import io from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;
  private apiUrl: string;

  constructor() {
    this.apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
  }

  connect() {
    if (!this.socket) {
      this.socket = io(this.apiUrl, {
        transports: ["websocket"]
      });

      this.socket.on("connect", () => {
        console.log("Connected to WebSocket server");
      });

      this.socket.on("disconnect", () => {
        console.log("Disconnected from WebSocket server");
      });

      this.socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(room: string) {
    if (this.socket) {
      this.socket.emit(`join-${room}-room`);
    }
  }

  leaveRoom(room: string) {
    if (this.socket) {
      this.socket.emit(`leave-${room}-room`);
    }
  }

  onEvent(event: string, callback: Function) {
    if (this.socket) {
      this.socket.on(event, (data) => callback(data));
    }
  }

  offEvent(event: string) {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

export const socketService = new SocketService();
export default socketService;