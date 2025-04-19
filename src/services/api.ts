
import axios from "axios";
import { Auction, AuctionRequest } from "@/types/auction";

// For Lovable preview, we'll use mock data instead of connecting to localhost
const IS_PRODUCTION = window.location.hostname !== "localhost";

// Create axios instance with conditional base URL
const api = axios.create({
  baseURL: IS_PRODUCTION ? undefined : "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Mock data for auctions
let mockAuctions: Auction[] = [];

// Add a request interceptor to include the JWT token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("artAuctionToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercept responses in production mode to mock backend behavior
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only use mocks in production mode
    if (IS_PRODUCTION && error.message === "Network Error") {
      console.log("Using mock data instead of real backend");
      return handleMockResponses(error.config);
    }
    return Promise.reject(error);
  }
);

// Mock response handler based on request URL and method
const handleMockResponses = (config) => {
  const { url, method, data } = config;
  
  // Mock user registration
  if (url === "/auth/signup" && method.toLowerCase() === "post") {
    const userData = JSON.parse(data);
    
    // Check if required fields are provided
    if (!userData.name || !userData.email || !userData.password) {
      return Promise.reject({
        response: { data: "All fields are required" }
      });
    }
    
    // Create mock user response
    const userId = `user-${Date.now()}`;
    const mockResponse = {
      data: {
        id: userId,
        name: userData.name,
        email: userData.email,
        token: `mock-token-${userId}`,
        roles: ["ROLE_USER"]
      }
    };
    
    return Promise.resolve(mockResponse);
  }
  
  // Mock login
  if (url === "/auth/login" && method.toLowerCase() === "post") {
    const loginData = JSON.parse(data);
    
    // Check admin login
    if (loginData.email === "art123bets@gmail.com" && loginData.password === "ARTROCKS123") {
      return Promise.resolve({
        data: {
          id: "admin-1",
          name: "ART Admin",
          email: "art123bets@gmail.com",
          token: "mock-token-for-admin",
          roles: ["ROLE_USER", "ROLE_ADMIN"]
        }
      });
    }
    
    // For demo purposes, any valid email/password combination will work
    if (loginData.email && loginData.password && loginData.password.length >= 6) {
      return Promise.resolve({
        data: {
          id: `user-${Date.now()}`,
          name: loginData.email.split("@")[0],
          email: loginData.email,
          token: `mock-token-${Date.now()}`,
          roles: ["ROLE_USER"]
        }
      });
    }
    
    return Promise.reject({
      response: { data: "Invalid credentials: Email or password is incorrect" }
    });
  }
  
  // Mock forgot password
  if (url.includes("/auth/forgot-password") && method.toLowerCase() === "post") {
    return Promise.resolve({
      data: "Password reset instructions sent to your email."
    });
  }

  // Mock get all auctions
  if (url === "/auctions" && method.toLowerCase() === "get") {
    return Promise.resolve({ data: mockAuctions });
  }

  // Mock get seller auctions
  if (url === "/auctions/seller" && method.toLowerCase() === "get") {
    const token = config.headers["Authorization"];
    const userId = token ? token.split("-").pop() : null;
    const sellerAuctions = mockAuctions.filter(auction => auction.sellerId === userId);
    return Promise.resolve({ data: sellerAuctions });
  }

  // Mock create auction
  if (url === "/auctions" && method.toLowerCase() === "post") {
    const token = config.headers["Authorization"];
    const userId = token ? token.split("-").pop() : `user-${Date.now()}`;
    const userName = `User ${userId.substring(0, 4)}`;

    // Handle FormData for file uploads
    let auctionData: AuctionRequest;
    if (data instanceof FormData) {
      // Extract auction data from FormData
      const formName = data.get('name') as string;
      const formDescription = data.get('description') as string;
      const formMinBid = parseFloat(data.get('minBid') as string);
      const formDurationHours = parseInt(data.get('durationHours') as string);
      const formCategory = data.get('category') as string;
      
      auctionData = {
        name: formName,
        description: formDescription,
        minBid: formMinBid,
        durationHours: formDurationHours,
        category: formCategory
      };
    } else {
      // For JSON data
      auctionData = JSON.parse(data);
    }

    const now = new Date();
    const endTime = new Date(now);
    endTime.setHours(endTime.getHours() + auctionData.durationHours);

    const newAuction: Auction = {
      id: `auction-${Date.now()}`,
      name: auctionData.name,
      description: auctionData.description,
      sellerId: userId,
      sellerName: userName,
      minBid: auctionData.minBid,
      currentBid: auctionData.minBid,
      status: "ACTIVE",
      category: auctionData.category || "other",
      endTime: endTime.toISOString(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      imageUrl: "https://via.placeholder.com/500?text=Auction+Item" // Placeholder image
    };

    mockAuctions.push(newAuction);
    return Promise.resolve({ data: newAuction });
  }

  // Mock place bid
  if (url === "/bids" && method.toLowerCase() === "post") {
    const bidData = JSON.parse(data);
    const { auctionId, amount } = bidData;
    
    const auction = mockAuctions.find(a => a.id === auctionId);
    if (!auction) {
      return Promise.reject({
        response: { data: "Auction not found" }
      });
    }

    if (amount <= auction.currentBid) {
      return Promise.reject({
        response: { data: "Bid amount must be higher than current bid" }
      });
    }

    const token = config.headers["Authorization"];
    const userId = token ? token.split("-").pop() : `user-${Date.now()}`;
    const userName = `User ${userId.substring(0, 4)}`;
    
    // Update auction with new bid
    auction.currentBid = amount;
    auction.currentBidderId = userId;
    auction.currentBidderName = userName;
    auction.updatedAt = new Date().toISOString();
    
    return Promise.resolve({ 
      data: {
        id: `bid-${Date.now()}`,
        auctionId,
        amount,
        bidderId: userId,
        bidderName: userName,
        createdAt: new Date().toISOString()
      }
    });
  }
  
  // Default response for unmocked endpoints
  return Promise.reject({
    response: { data: "This API endpoint is not available in preview mode." }
  });
};

// Auth API
export const authAPI = {
  login: (email: string, password: string) => 
    api.post("/auth/login", { email, password }),
  
  register: (name: string, email: string, password: string) => 
    api.post("/auth/signup", { name, email, password }),
  
  forgotPassword: (email: string) => 
    api.post("/auth/forgot-password", null, { params: { email } }),
};

// Auctions API
export const auctionsAPI = {
  getAll: () => api.get("/auctions"),
  
  getById: (id: string) => api.get(`/auctions/${id}`),
  
  getSellerAuctions: () => api.get("/auctions/seller"),
  
  create: (auctionData: FormData) => 
    api.post("/auctions", auctionData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    }),
  
  cancel: (id: string) => api.put(`/auctions/${id}/cancel`),
};

// Bids API
export const bidsAPI = {
  getByAuction: (auctionId: string) => 
    api.get(`/bids/auction/${auctionId}`),
  
  getUserBids: () => api.get("/bids/user"),
  
  placeBid: (auctionId: string, amount: number) => 
    api.post("/bids", { auctionId, amount }),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get("/users/profile"),
  
  getAllUsers: () => api.get("/users"),
  
  toggleUserStatus: (id: string) => 
    api.put(`/users/${id}/toggle-status`),
  
  promoteToAdmin: (id: string) => api.put(`/users/${id}/promote`),
  
  updateProfile: (updates: { name?: string }) => 
    api.put("/users/profile", updates),
};

// Messages API
export const messagesAPI = {
  getAll: () => api.get("/messages"),
  
  getUnread: () => api.get("/messages/unread"),
  
  markAsRead: (id: string) => api.put(`/messages/${id}/read`),
  
  create: (messageData: {
    recipientId: string;
    content: string;
    type: string;
    auctionId?: string;
  }) => api.post("/messages", messageData),
};

export default api;
