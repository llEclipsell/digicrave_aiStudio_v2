type MessageHandler = (data: any) => void;

class WebSocketManager {
  private socket: WebSocket | null = null;
  private handlers: Map<string, MessageHandler[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private url: string = "";

  private static readonly WS_BASE_URL = 
    import.meta.env.VITE_WS_URL || 
    (window.location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + window.location.host + '/ws';

  connect(path: string) {
    this.url = `${WebSocketManager.WS_BASE_URL}${path}`;
    
    try {
      this.socket = new WebSocket(this.url);
    } catch (e) {
      console.error("Failed to construct WebSocket:", e);
      return;
    }

    this.socket.onopen = () => {
      console.log("WebSocket Connected");
      this.reconnectAttempts = 0;
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data && data.type) {
          const handlers = this.handlers.get(data.type) || [];
          handlers.forEach(handler => handler(data.payload));
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    this.socket.onclose = () => {
      console.log("WebSocket Disconnected");
      this.attemptReconnect();
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000;
      setTimeout(() => this.connect(this.url.replace(WebSocketManager.WS_BASE_URL, "")), delay);
    }
  }

  on(event: string, handler: MessageHandler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)?.push(handler);
  }

  off(event: string, handler: MessageHandler) {
    const handlers = this.handlers.get(event) || [];
    this.handlers.set(event, handlers.filter(h => h !== handler));
  }

  disconnect() {
    if (this.socket) {
      // Prevent reconnect on intentional disconnect
      this.socket.onclose = null;
      this.socket.close();
      this.socket = null;
    }
  }
}

export const wsManager = new WebSocketManager();
