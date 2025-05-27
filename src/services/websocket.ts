
interface MockNotification {
  type: 'auction_ended' | 'new_bid' | 'auction_won';
  message: string;
  auctionId?: string;
  timestamp: string;
}

let notificationCallbacks: ((notification: MockNotification) => void)[] = [];
let isConnected = false;
let intervalId: NodeJS.Timeout | null = null;
let bidNotificationTimeout: NodeJS.Timeout | null = null;

const websocket = {
  connect: (userId: string) => {
    console.log(`[WebSocket] Connecting for user: ${userId}`);
    isConnected = true;
    
    // Simulate connection delay
    setTimeout(() => {
      console.log(`[WebSocket] Connected successfully for user: ${userId}`);
      
      // Clear any existing interval
      if (intervalId) {
        clearInterval(intervalId);
      }
      
      // Simulate periodic auction ending notifications (less frequent for testing)
      intervalId = setInterval(() => {
        if (isConnected && notificationCallbacks.length > 0) {
          const mockNotification: MockNotification = {
            type: 'auction_ended',
            message: `An auction you were watching has ended! Check the results.`,
            timestamp: new Date().toISOString()
          };
          
          console.log('[WebSocket] Sending auction end notification:', mockNotification);
          notificationCallbacks.forEach(callback => {
            try {
              callback(mockNotification);
            } catch (error) {
              console.error('[WebSocket] Error in notification callback:', error);
            }
          });
        }
      }, 45000); // Every 45 seconds for testing
    }, 1000);
    
    return true;
  },

  disconnect: () => {
    console.log('[WebSocket] Disconnecting');
    isConnected = false;
    notificationCallbacks = [];
    
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    
    if (bidNotificationTimeout) {
      clearTimeout(bidNotificationTimeout);
      bidNotificationTimeout = null;
    }
  },

  onNotification: (callback: (notification: MockNotification) => void) => {
    console.log('[WebSocket] Adding notification callback');
    notificationCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = notificationCallbacks.indexOf(callback);
      if (index > -1) {
        notificationCallbacks.splice(index, 1);
      }
    };
  },

  sendBidNotification: (auctionId: string, bidAmount: number, bidderName: string) => {
    if (!isConnected) {
      console.warn('[WebSocket] Not connected, cannot send bid notification');
      return;
    }
    
    const notification: MockNotification = {
      type: 'new_bid',
      message: `New bid of $${bidAmount.toLocaleString()} placed by ${bidderName}`,
      auctionId,
      timestamp: new Date().toISOString()
    };
    
    console.log('[WebSocket] Sending bid notification:', notification);
    
    // Clear existing timeout if any
    if (bidNotificationTimeout) {
      clearTimeout(bidNotificationTimeout);
    }
    
    // Simulate network delay for bid notification
    bidNotificationTimeout = setTimeout(() => {
      notificationCallbacks.forEach(callback => {
        try {
          callback(notification);
        } catch (error) {
          console.error('[WebSocket] Error in bid notification callback:', error);
        }
      });
    }, 800);
  },

  isConnected: () => isConnected
};

export default websocket;
