
import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { authAPI } from "@/services/api";
import websocket from "@/services/websocket";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check for stored token on mount
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("artAuctionUser");
      const token = localStorage.getItem("artAuctionToken");

      if (storedUser && token) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          // Connect to WebSocket with user ID
          websocket.connect(parsedUser.id);
        } catch (e) {
          localStorage.removeItem("artAuctionUser");
          localStorage.removeItem("artAuctionToken");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // For demo purposes, let's keep the mock admin login
      if (email === "art123bets@gmail.com" && password === "ARTROCKS123") {
        const adminUser = {
          id: "admin-1",
          name: "ART",
          email: "art123bets@gmail.com",
          role: "admin" as const
        };
        setUser(adminUser);
        localStorage.setItem("artAuctionUser", JSON.stringify(adminUser));
        localStorage.setItem("artAuctionToken", "mock-token-for-admin");
        websocket.connect(adminUser.id);
        toast({
          title: "Admin Login Successful",
          description: "Welcome back, ART Admin!",
        });
        return;
      }

      const response = await authAPI.login(email, password);
      const userData = response.data;
      
      // Transform to match our User interface with correct typing
      const userObj: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.roles.includes("ROLE_ADMIN") ? "admin" as const : "user" as const
      };

      setUser(userObj);
      localStorage.setItem("artAuctionUser", JSON.stringify(userObj));
      localStorage.setItem("artAuctionToken", userData.token);
      
      // Connect to WebSocket with user ID
      websocket.connect(userObj.id);

      toast({
        title: "Login Successful",
        description: "Welcome back to ART Auction!",
      });

    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      await authAPI.register(name, email, password);
      
      // After registration, log in the user
      await login(email, password);
      
      toast({
        title: "Registration Successful",
        description: "Welcome to ART Auction!",
      });
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "An error occurred during registration.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Disconnect WebSocket
    websocket.disconnect();
    
    // Clear user data
    setUser(null);
    localStorage.removeItem("artAuctionUser");
    localStorage.removeItem("artAuctionToken");
    
    toast({
      title: "Logged Out",
      description: "You've been successfully logged out.",
    });
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      await authAPI.forgotPassword(email);
      toast({
        title: "Password Reset Email Sent",
        description: "Check your inbox for password reset instructions.",
      });
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        variant: "destructive",
        title: "Password Reset Failed",
        description: "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
