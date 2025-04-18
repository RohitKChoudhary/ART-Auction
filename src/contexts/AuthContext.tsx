
import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { authAPI } from "@/services/api";
import websocket from "@/services/websocket";
import { User } from "@/types/user";

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

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const storedUser = localStorage.getItem("artAuctionUser");
    const token = localStorage.getItem("artAuctionToken");

    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        try {
          websocket.connect(parsedUser.id);
        } catch (e) {
          console.log("WebSocket connection skipped:", e.message);
        }
      } catch (e) {
        localStorage.removeItem("artAuctionUser");
        localStorage.removeItem("artAuctionToken");
      }
    }
    setIsLoading(false);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(email, password);
      const userData = response.data;
      
      if (!userData) {
        throw new Error("Invalid response from server");
      }

      const userObj: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: Array.isArray(userData.roles) && userData.roles.includes("ROLE_ADMIN") ? 
              "admin" : "user"
      };

      setUser(userObj);
      localStorage.setItem("artAuctionUser", JSON.stringify(userObj));
      localStorage.setItem("artAuctionToken", userData.token);
      
      try {
        websocket.connect(userObj.id);
      } catch (e) {
        console.log("WebSocket connection skipped:", e.message);
      }

      toast({
        title: "Login Successful",
        description: "Welcome to ART Auction!",
      });

    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data || "Invalid credentials. Please try again.";
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.register(name, email, password);
      const userData = response.data;
      
      if (userData && userData.token) {
        const userObj: User = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: Array.isArray(userData.roles) && userData.roles.includes("ROLE_ADMIN") ? 
                "admin" : "user"
        };

        setUser(userObj);
        localStorage.setItem("artAuctionUser", JSON.stringify(userObj));
        localStorage.setItem("artAuctionToken", userData.token);
        
        try {
          websocket.connect(userObj.id);
        } catch (e) {
          console.log("WebSocket connection skipped:", e.message);
        }

        toast({
          title: "Registration Successful",
          description: "Welcome to ART Auction!",
        });
        return;
      }
      
      toast({
        title: "Registration Successful",
        description: "Please log in with your new credentials.",
      });
      
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage = error.response?.data || "An error occurred during registration.";
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      websocket.disconnect();
    } catch (e) {
      console.log("WebSocket disconnect skipped:", e.message);
    }
    
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
    } catch (error: any) {
      console.error("Password reset error:", error);
      const errorMessage = error.response?.data || "An error occurred. Please try again.";
      toast({
        variant: "destructive",
        title: "Password Reset Failed",
        description: errorMessage,
      });
      throw error;
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
