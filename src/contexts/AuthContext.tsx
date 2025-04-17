
import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

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
    const storedUser = localStorage.getItem("artAuctionUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("artAuctionUser");
      }
    }
    setIsLoading(false);
  }, []);

  // Mock login function - will be replaced with actual API call
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // This is a mock - in a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock admin login
      if (email === "art123bets@gmail.com" && password === "ARTROCKS123") {
        const adminUser = {
          id: "admin-1",
          name: "ART",
          email: "art123bets@gmail.com",
          role: "admin" as const
        };
        setUser(adminUser);
        localStorage.setItem("artAuctionUser", JSON.stringify(adminUser));
        toast({
          title: "Admin Login Successful",
          description: "Welcome back, ART Admin!",
        });
        return;
      }

      // Mock regular user login
      const mockUser = {
        id: "user-" + Math.floor(Math.random() * 1000),
        name: email.split("@")[0],
        email,
        role: "user" as const
      };
      
      setUser(mockUser);
      localStorage.setItem("artAuctionUser", JSON.stringify(mockUser));
      toast({
        title: "Login Successful",
        description: "Welcome back to ART Auction!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mock register function
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // This is a mock - in a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newUser = {
        id: "user-" + Math.floor(Math.random() * 1000),
        name,
        email,
        role: "user" as const
      };
      
      setUser(newUser);
      localStorage.setItem("artAuctionUser", JSON.stringify(newUser));
      toast({
        title: "Registration Successful",
        description: "Welcome to ART Auction!",
      });
    } catch (error) {
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
    setUser(null);
    localStorage.removeItem("artAuctionUser");
    toast({
      title: "Logged Out",
      description: "You've been successfully logged out.",
    });
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      // This is a mock - in a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      toast({
        title: "Password Reset Email Sent",
        description: "Check your inbox for password reset instructions.",
      });
    } catch (error) {
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
