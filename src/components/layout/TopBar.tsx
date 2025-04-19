
import React from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface TopBarProps {
  onMenuClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  return (
    <div className="md:hidden h-16 flex items-center justify-between px-4 border-b border-border/50">
      <Button
        variant="ghost"
        onClick={onMenuClick}
        aria-label="Menu"
      >
        <Menu className="h-5 w-5" />
      </Button>
      <span className="art-gradient-text font-bold text-xl">ART AUCTION</span>
      <div className="w-10"></div> {/* Spacer to balance the layout */}
    </div>
  );
};

export default TopBar;
