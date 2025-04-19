
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, ShoppingBag, Package2, 
  MessageSquare, User, Users, LogOut 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import NavItem from "./NavItem";

const MainSidebar: React.FC = () => {
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

  return (
    <aside className="hidden md:flex md:w-64 flex-col fixed inset-y-0">
      <div className="flex flex-col h-full bg-art-dark-blue border-r border-border/50">
        <div className="h-16 flex items-center justify-center border-b border-border/50">
          <span className="art-gradient-text font-bold text-xl">ART AUCTION</span>
        </div>
        
        <nav className="flex flex-col flex-1 pt-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavItem 
              key={item.name}
              item={item}
            />
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
    </aside>
  );
};

export default MainSidebar;
