
import axios from "axios";

const API_URL = "http://localhost:8080/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
