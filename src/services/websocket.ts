
const IS_PRODUCTION = window.location.hostname !== "localhost";

interface MockNotification {
  type: 'auction_ended' | 'new_bid' | 'auction_won';
  message: string;
  auctionId?: string;
  timestamp: string;
}

let notificationCallbacks: ((notification: MockNotification) => void)[] = [];

const websocket = {
  connect: (userId: string) => {
    if (IS_PRODUCTION) {
      console.log(`[Mock WebSocket] Connected for user: ${userId}`);
      
      // Simulate auction ending notifications after 30 seconds
      setTimeout(() => {
        const mockNotification: MockNotification = {
          type: 'auction_ended',
          message: `An auction you were watching has ended!`,
          timestamp: new Date().toISOString()
        };
        
        notificationCallbacks.forEach(callback => callback(mockNotification));
      }, 30000);
      
      return true;
    }

    console.log(`[WebSocket] Attempting to connect for user: ${userId}`);
    return true;
  },

  disconnect: () => {
    if (IS_PRODUCTION) {
      console.log('[Mock WebSocket] Disconnected');
      notificationCallbacks = [];
      return;
    }

    console.log('[WebSocket] Disconnected');
  },

  onNotification: (callback: (notification: MockNotification) => void) => {
    notificationCallbacks.push(callback);
  },

  sendBidNotification: (auctionId: string, bidAmount: number, bidderName: string) => {
    if (IS_PRODUCTION) {
      const notification: MockNotification = {
        type: 'new_bid',
        message: `New bid of $${bidAmount} placed by ${bidderName}`,
        auctionId,
        timestamp: new Date().toISOString()
      };
      
      // Simulate delay and notify all callbacks
      setTimeout(() => {
        notificationCallbacks.forEach(callback => callback(notification));
      }, 1000);
    }
  }
};

export default websocket;
