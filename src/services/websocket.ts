import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const SOCKET_URL = "http://localhost:8080/ws";

class WebSocketService {
  private client: Client | null = null;
  private reconnectTimeout: number | null = null;
  private subscriptions: { [key: string]: { id: string, callback: (data: any) => void }[] } = {};

  connect(userId: string | undefined, onConnect?: () => void): void {
    if (this.client) {
      this.disconnect();
    }

    this.client = new Client({
      webSocketFactory: () => new SockJS(SOCKET_URL),
      debug: (str) => {
        console.debug(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log("WebSocket connected successfully");
        
        // Resubscribe to topics after reconnect
        Object.keys(this.subscriptions).forEach(topic => {
          this.subscriptions[topic].forEach(sub => {
            this.subscribe(topic, sub.callback);
          });
        });

        if (userId) {
          // Subscribe to user-specific topics
          this.subscribe(`/user/${userId}/queue/notifications`, (message) => {
            console.log("Received notification:", message);
            // Handle notification in the application
          });

          this.subscribe(`/user/${userId}/queue/messages`, (message) => {
            console.log("Received message:", message);
            // Handle message in the application
          });
        }

        if (onConnect) {
          onConnect();
        }
      },
      onStompError: (frame) => {
        console.error('STOMP error', frame);
      },
      onWebSocketClose: () => {
        console.log('WebSocket connection closed');
        this.scheduleReconnect();
      }
    });

    try {
      console.log("Attempting to connect to WebSocket...");
      this.client.activate();
    } catch (error) {
      console.error("Error connecting to WebSocket:", error);
    }
  }

  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  private scheduleReconnect(): void {
    if (!this.reconnectTimeout) {
      this.reconnectTimeout = window.setTimeout(() => {
        console.log('Attempting to reconnect WebSocket...');
        if (this.client) {
          this.client.activate();
        }
        this.reconnectTimeout = null;
      }, 5000);
    }
  }

  subscribe(topic: string, callback: (data: any) => void): void {
    if (!this.client || !this.client.connected) {
      console.error('WebSocket not connected');
      return;
    }

    const subscription = this.client.subscribe(topic, (message) => {
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error('Error parsing message', error);
        callback(message.body);
      }
    });

    // Track subscription for reconnect
    if (!this.subscriptions[topic]) {
      this.subscriptions[topic] = [];
    }
    this.subscriptions[topic].push({ id: subscription.id, callback });
  }

  unsubscribe(topic: string): void {
    if (!this.client || !this.subscriptions[topic]) {
      return;
    }

    this.subscriptions[topic].forEach(sub => {
      this.client?.unsubscribe(sub.id);
    });

    delete this.subscriptions[topic];
  }

  send(destination: string, body: any): void {
    if (!this.client || !this.client.connected) {
      console.error('WebSocket not connected');
      return;
    }

    this.client.publish({
      destination,
      body: JSON.stringify(body)
    });
  }

  isConnected(): boolean {
    return !!this.client && !!this.client.connected;
  }
}

export default new WebSocketService();
