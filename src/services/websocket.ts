import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { toast } from '@/hooks/use-toast';

interface WebSocketNotification {
  type: 'auction_ended' | 'new_bid' | 'auction_won';
  message: string;
  auctionId?: string;
  timestamp: string;
}

class WebSocketService {
  private client: Client | null = null;
  private notificationCallbacks: ((notification: WebSocketNotification) => void)[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(userId: string) {
    if (this.client) {
      this.disconnect();
    }

    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: {
        'user-id': userId
      },
      debug: (str) => {
        console.log('STOMP:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    this.client.onConnect = () => {
      console.log('WebSocket Connected');
      this.reconnectAttempts = 0;

      // Subscribe to user-specific notifications
      this.client?.subscribe(`/user/${userId}/queue/notifications`, (message) => {
        try {
          const notification = JSON.parse(message.body) as WebSocketNotification;
          this.notificationCallbacks.forEach(callback => callback(notification));
        } catch (error) {
          console.error('Error processing notification:', error);
        }
      });

      // Subscribe to auction updates
      this.client?.subscribe('/topic/auctions', (message) => {
        try {
          const update = JSON.parse(message.body);
          // Handle auction updates
          toast({
            title: "Auction Update",
            description: update.message
          });
        } catch (error) {
          console.error('Error processing auction update:', error);
        }
      });
    };

    this.client.onStompError = (frame) => {
      console.error('STOMP error:', frame);
      this.handleConnectionError();
    };

    this.client.onWebSocketError = (event) => {
      console.error('WebSocket error:', event);
      this.handleConnectionError();
    };

    this.client.activate();
  }

  private handleConnectionError() {
    this.reconnectAttempts++;
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Unable to connect to the server. Please refresh the page."
      });
    }
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.notificationCallbacks = [];
    }
  }

  onNotification(callback: (notification: WebSocketNotification) => void) {
    this.notificationCallbacks.push(callback);
    return () => {
      this.notificationCallbacks = this.notificationCallbacks.filter(cb => cb !== callback);
    };
  }

  sendBidNotification(auctionId: string, bidAmount: number) {
    if (!this.client?.connected) {
      console.warn('WebSocket not connected');
      return;
    }

    this.client.publish({
      destination: `/app/auction/${auctionId}/bid`,
      body: JSON.stringify({ auctionId, amount: bidAmount })
    });
  }

  isConnected() {
    return this.client?.connected || false;
  }
}

export default new WebSocketService();