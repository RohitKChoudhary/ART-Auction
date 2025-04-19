
import React from "react";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  onMenuClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  return (
    <div className="md:hidden h-16 flex items-center justify-between px-4 border-b border-border/50">
      <Button
        variant="ghost"
        onClick={onMenuClick}
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
  );
};

export default TopBar;
