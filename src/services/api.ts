
import axios from "axios";
import { Auction, AuctionRequest } from "@/types/auction";

const IS_PRODUCTION = window.location.hostname !== "localhost";

const api = axios.create({
  baseURL: IS_PRODUCTION ? undefined : "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Mock data storage - Initialize with proper data
let mockAuctions: Auction[] = [
  {
    id: "auction-1",
    name: "Vintage Art Painting",
    description: "Beautiful vintage painting from the 19th century",
    sellerId: "user-1",
    sellerName: "John Artist",
    minBid: 100,
    currentBid: 150,
    currentBidderId: "user-2",
    currentBidderName: "Jane Collector",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
    status: "ACTIVE",
    category: "art",
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "auction-2", 
    name: "Antique Vase",
    description: "Rare antique vase from Ming dynasty",
    sellerId: "user-3",
    sellerName: "Mike Antiques",
    minBid: 500,
    currentBid: 750,
    currentBidderId: "user-1",
    currentBidderName: "John Artist",
    imageUrl: "https://images.unsplash.com/photo-1578662015725-2d4b2d8b3e8c?w=500",
    status: "ACTIVE", 
    category: "antiques",
    endTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "auction-3",
    name: "Modern Sculpture",
    description: "Contemporary bronze sculpture by emerging artist",
    sellerId: "admin-1",
    sellerName: "ART Admin",
    minBid: 800,
    currentBid: 800,
    imageUrl: "https://images.unsplash.com/photo-1594736797933-d0402ba2fe65?w=500",
    status: "ACTIVE",
    category: "art", 
    endTime: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let mockUsers = [
  {
    id: "user-1",
    name: "John Artist",
    email: "john@example.com",
    roles: ["ROLE_USER"],
    active: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "user-2", 
    name: "Jane Collector",
    email: "jane@example.com",
    roles: ["ROLE_USER"],
    active: true,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "user-3",
    name: "Mike Antiques", 
    email: "mike@example.com",
    roles: ["ROLE_USER"],
    active: true,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "admin-1",
    name: "ART Admin",
    email: "art123bets@gmail.com", 
    roles: ["ROLE_USER", "ROLE_ADMIN"],
    active: true,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Add request interceptor
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

// Add response interceptor for mock data
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (IS_PRODUCTION && error.message === "Network Error") {
      console.log("Using mock data instead of real backend");
      return handleMockResponses(error.config);
    }
    return Promise.reject(error);
  }
);

const handleMockResponses = async (config) => {
  const { url, method, data } = config;
  
  console.log(`Mock API call: ${method?.toUpperCase()} ${url}`, data);
  
  // Auth endpoints
  if (url === "/auth/signup" && method?.toLowerCase() === "post") {
    const userData = JSON.parse(data);
    
    if (!userData.name || !userData.email || !userData.password) {
      return Promise.reject({
        response: { data: "All fields are required" }
      });
    }
    
    const userId = `user-${Date.now()}`;
    const newUser = {
      id: userId,
      name: userData.name,
      email: userData.email,
      roles: ["ROLE_USER"],
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockUsers.push(newUser);
    
    return Promise.resolve({
      data: {
        ...newUser,
        token: `mock-token-${userId}`
      }
    });
  }
  
  if (url === "/auth/login" && method?.toLowerCase() === "post") {
    const loginData = JSON.parse(data);
    
    if (loginData.email === "art123bets@gmail.com" && loginData.password === "ARTROCKS123") {
      return Promise.resolve({
        data: {
          id: "admin-1",
          name: "ART Admin",
          email: "art123bets@gmail.com",
          token: "mock-token-admin-1",
          roles: ["ROLE_USER", "ROLE_ADMIN"]
        }
      });
    }
    
    if (loginData.email && loginData.password && loginData.password.length >= 6) {
      let userId = `user-${Date.now()}`;
      let userName = loginData.email.split("@")[0];
      
      const existingUser = mockUsers.find(u => u.email === loginData.email);
      if (existingUser) {
        userId = existingUser.id;
        userName = existingUser.name;
      } else {
        const newUser = {
          id: userId,
          name: userName,
          email: loginData.email,
          roles: ["ROLE_USER"],
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        mockUsers.push(newUser);
      }
      
      return Promise.resolve({
        data: {
          id: userId,
          name: userName,
          email: loginData.email,
          token: `mock-token-${userId}`,
          roles: ["ROLE_USER"]
        }
      });
    }
    
    return Promise.reject({
      response: { data: "Invalid credentials: Email or password is incorrect" }
    });
  }
  
  if (url?.includes("/auth/forgot-password") && method?.toLowerCase() === "post") {
    return Promise.resolve({
      data: "Password reset instructions sent to your email."
    });
  }

  // Auction endpoints
  if (url === "/auctions" && method?.toLowerCase() === "get") {
    console.log("Returning mock auctions:", mockAuctions);
    return Promise.resolve({ data: mockAuctions });
  }

  if (url === "/auctions/seller" && method?.toLowerCase() === "get") {
    const token = config.headers["Authorization"];
    if (!token) {
      return Promise.reject({ response: { data: "No token provided" } });
    }
    
    const userId = token.replace("Bearer mock-token-", "");
    console.log("Getting seller auctions for user:", userId);
    const sellerAuctions = mockAuctions.filter(auction => auction.sellerId === userId);
    console.log("Found seller auctions:", sellerAuctions);
    return Promise.resolve({ data: sellerAuctions });
  }

  if (url === "/auctions" && method?.toLowerCase() === "post") {
    const token = config.headers["Authorization"];
    if (!token) {
      return Promise.reject({ response: { data: "No token provided" } });
    }
    
    const userId = token.replace("Bearer mock-token-", "");
    const user = mockUsers.find(u => u.id === userId);
    const userName = user ? user.name : `User ${userId.substring(0, 4)}`;

    let auctionData;
    if (data instanceof FormData) {
      auctionData = {
        name: data.get('name') as string,
        description: data.get('description') as string,
        minBid: parseFloat(data.get('minBid') as string),
        durationHours: parseInt(data.get('durationHours') as string),
        category: data.get('category') as string || "other"
      };
    } else {
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      auctionData = parsedData;
    }

    if (!auctionData.name || !auctionData.description || !auctionData.minBid) {
      return Promise.reject({
        response: { data: "Missing required fields" }
      });
    }

    const now = new Date();
    const endTime = new Date(now);
    endTime.setHours(endTime.getHours() + (auctionData.durationHours || 24));

    const newAuction: Auction = {
      id: `auction-${Date.now()}`,
      name: auctionData.name,
      description: auctionData.description,
      sellerId: userId,
      sellerName: userName,
      minBid: auctionData.minBid,
      currentBid: auctionData.minBid,
      status: "ACTIVE",
      category: auctionData.category,
      endTime: endTime.toISOString(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      imageUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500"
    };

    mockAuctions.push(newAuction);
    console.log("Created new auction:", newAuction);
    return Promise.resolve({ data: newAuction });
  }

  // Bid endpoints
  if (url === "/bids" && method?.toLowerCase() === "post") {
    const bidData = typeof data === 'string' ? JSON.parse(data) : data;
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
    const userId = token ? token.replace("Bearer mock-token-", "") : `user-${Date.now()}`;
    const user = mockUsers.find(u => u.id === userId);
    const userName = user ? user.name : `User ${userId.substring(0, 4)}`;
    
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

  // User endpoints
  if (url === "/users" && method?.toLowerCase() === "get") {
    console.log("Returning mock users:", mockUsers);
    return Promise.resolve({ data: mockUsers });
  }

  if (url === "/users/profile" && method?.toLowerCase() === "get") {
    const token = config.headers["Authorization"];
    if (!token) {
      return Promise.reject({ response: { data: "No token provided" } });
    }
    
    const userId = token.replace("Bearer mock-token-", "");
    const user = mockUsers.find(u => u.id === userId);
    
    if (user) {
      return Promise.resolve({ data: user });
    }
    return Promise.reject({ response: { data: "User not found" } });
  }
  
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
