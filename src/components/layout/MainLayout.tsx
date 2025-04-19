
import React, { useState } from "react";
import MainSidebar from "./MainSidebar";
import MobileSidebar from "./MobileSidebar";
import TopBar from "./TopBar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(prev => !prev);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-art-dark overflow-hidden">
      {/* Desktop sidebar */}
      <MainSidebar />
      
      {/* Mobile sidebar overlay and content */}
      <MobileSidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={closeMobileSidebar} 
      />

      {/* Main content */}
      <div className="flex-1 md:ml-64 flex flex-col">
        {/* Mobile header */}
        <TopBar onMenuClick={toggleMobileSidebar} />

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
