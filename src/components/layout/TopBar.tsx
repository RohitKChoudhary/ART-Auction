
import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import NotificationHandler from "@/components/notifications/NotificationHandler";

interface TopBarProps {
  onMenuClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <header className="bg-art-dark-blue border-b border-art-purple/30 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="md:hidden text-white hover:bg-art-purple/20"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold art-gradient-text">
            ART Auction
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <NotificationHandler />
          
          {user && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-300 hidden sm:inline">
                Welcome, {user.name}
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleProfileClick}
                className="text-white hover:bg-art-purple/20"
                title="Profile"
              >
                <User className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white hover:bg-art-purple/20"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
