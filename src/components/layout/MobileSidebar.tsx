
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, ShoppingBag, Package2, 
  MessageSquare, User, Users, LogOut 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import NavItem from "./NavItem";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Buyer Table",
      href: "/buyer",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      name: "Seller Table",
      href: "/seller",
      icon: <Package2 className="h-5 w-5" />,
    },
    {
      name: "Inbox",
      href: "/inbox",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: <User className="h-5 w-5" />,
    },
  ];

  // Add admin link if user is admin
  if (user?.role === "admin") {
    navItems.push({
      name: "Admin Panel",
      href: "/admin",
      icon: <Users className="h-5 w-5" />,
    });
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavigation = (href: string) => {
    navigate(href);
    onClose();
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div 
        className={`fixed inset-y-0 left-0 w-64 bg-art-dark-blue z-30 md:hidden transition-transform duration-200 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
          <span className="art-gradient-text font-bold text-xl">ART AUCTION</span>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400"
            onClick={onClose}
          >
            &times;
          </Button>
        </div>
        
        <nav className="flex flex-col flex-1 pt-4 px-3 space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              className="flex items-center justify-start space-x-3 px-3 py-6"
              onClick={() => handleNavigation(item.href)}
            >
              {item.icon}
              <span>{item.name}</span>
            </Button>
          ))}
        </nav>

        <div className="p-4 border-t border-border/50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-art-purple flex items-center justify-center">
                <span className="text-white font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout} 
            className="w-full border-art-purple/50 text-art-purple hover:bg-art-purple/10"
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
