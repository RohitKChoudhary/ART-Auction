
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItemProps {
  item: {
    name: string;
    href: string;
    icon: React.ReactNode;
  };
}

const NavItem: React.FC<NavItemProps> = ({ item }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = location.pathname === item.href;

  return (
    <Button
      variant="ghost"
      className={cn(
        "flex w-full items-center justify-start space-x-3 px-3 py-6",
        isActive
          ? "bg-art-purple/20 text-art-purple"
          : "text-gray-300 hover:bg-art-purple/10 hover:text-art-purple"
      )}
      onClick={() => navigate(item.href)}
    >
      {item.icon}
      <span>{item.name}</span>
    </Button>
  );
};

export default NavItem;
