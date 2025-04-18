// Mock WebSocket service for Lovable preview

const IS_PRODUCTION = window.location.hostname !== "localhost";

// This object will mock the WebSocket service
const websocket = {
  connect: (userId: string) => {
    if (IS_PRODUCTION) {
      console.log(`[Mock WebSocket] Connected for user: ${userId}`);
      return true;
    }

    // In development, attempt real connection (if available)
    console.log(`[WebSocket] Attempting to connect for user: ${userId}`);
    // Here would be the real WebSocket connection logic
    return true;
  },

  disconnect: () => {
    if (IS_PRODUCTION) {
      console.log('[Mock WebSocket] Disconnected');
      return;
    }

    // In development, disconnect real connection
    console.log('[WebSocket] Disconnected');
    // Real disconnect logic would go here
  },

  // Additional WebSocket methods would go here
};

export default websocket;
