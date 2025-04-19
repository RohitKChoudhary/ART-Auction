
import React from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AuctionFiltersProps {
  searchTerm: string;
  activeTab: string;
  onSearchChange: (value: string) => void;
  onTabChange: (value: string) => void;
}

const AuctionFilters: React.FC<AuctionFiltersProps> = ({
  searchTerm,
  activeTab,
  onSearchChange,
  onTabChange
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <Input
        className="max-w-sm art-input"
        placeholder="Search auctions..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList className="bg-art-charcoal">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="electronics">Electronics</TabsTrigger>
          <TabsTrigger value="collectibles">Collectibles</TabsTrigger>
          <TabsTrigger value="fashion">Fashion</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default AuctionFilters;
