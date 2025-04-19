
import React from "react";
import { useAuth } from "@/contexts/AuthContext";

const DashboardWelcome: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}!</h1>
      <p className="text-gray-400">
        ART Auction is a secure platform where buyers and sellers connect in real-time. 
        Bid, list, and manage your auctions with confidence.
      </p>
    </div>
  );
};

export default DashboardWelcome;
