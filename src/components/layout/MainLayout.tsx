
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, ShoppingBag, Package2, 
  MessageSquare, User, Settings, LogOut, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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

  const handleNavigation = (href: string) => {
    navigate(href);
    setIsMobileSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-art-dark overflow-hidden">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex md:w-64 flex-col fixed inset-y-0">
        <div className="flex flex-col h-full bg-art-dark-blue border-r border-border/50">
          <div className="h-16 flex items-center justify-center border-b border-border/50">
            <span className="art-gradient-text font-bold text-xl">ART AUCTION</span>
          </div>
          
          <nav className="flex flex-col flex-1 pt-4 px-3 space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className={cn(
                  "flex items-center justify-start space-x-3 px-3 py-6",
                  location.pathname === item.href
                    ? "bg-art-purple/20 text-art-purple"
                    : "text-gray-300 hover:bg-art-purple/10 hover:text-art-purple"
                )}
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
      </aside>

      {/* Mobile sidebar */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity duration-200 ${
          isMobileSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileSidebarOpen(false)}
      />

      <div 
        className={`fixed inset-y-0 left-0 w-64 bg-art-dark-blue z-30 md:hidden transition-transform duration-200 transform ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
          <span className="art-gradient-text font-bold text-xl">ART AUCTION</span>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            &times;
          </Button>
        </div>
        
        <nav className="flex flex-col flex-1 pt-4 px-3 space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              className={cn(
                "flex items-center justify-start space-x-3 px-3 py-6",
                location.pathname === item.href
                  ? "bg-art-purple/20 text-art-purple"
                  : "text-gray-300 hover:bg-art-purple/10 hover:text-art-purple"
              )}
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

      {/* Main content */}
      <div className="flex-1 md:ml-64 flex flex-col">
        {/* Mobile header */}
        <div className="md:hidden h-16 flex items-center justify-between px-4 border-b border-border/50">
          <Button
            variant="ghost"
            onClick={() => setIsMobileSidebarOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </Button>
          <span className="art-gradient-text font-bold text-xl">ART AUCTION</span>
          <div className="w-10"></div> {/* Spacer to balance the layout */}
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
