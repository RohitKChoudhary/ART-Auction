
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { auctionsAPI } from "@/services/api";
import { Auction } from "@/types/auction";
import AuctionCard from "@/components/buyer/AuctionCard";
import AuctionFilters from "@/components/buyer/AuctionFilters";

const Buyer: React.FC = () => {
  const [bidAmounts, setBidAmounts] = useState<Record<string, number | null>>({});
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isBidding, setIsBidding] = useState(false);

  // Fetch active auctions
  const { data: auctions, isLoading } = useQuery({
    queryKey: ["active-auctions"],
    queryFn: async () => {
      try {
        const response = await auctionsAPI.getAll();
        return Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error("Error fetching auctions:", error);
        return [];
      }
    }
  });

  const handleBidChange = (id: string, value: string) => {
    const numValue = parseInt(value);
    setBidAmounts({ 
      ...bidAmounts, 
      [id]: isNaN(numValue) ? null : numValue 
    });
  };

  // Filter auctions based on active tab and search term
  const filteredAuctions = auctions ? auctions.filter((auction: Auction) => {
    // Only show active auctions
    if (auction.status !== "ACTIVE") return false;
    
    // Filter by category if a specific tab is selected
    const matchesTab = activeTab === "all" || 
                      (auction.category && auction.category.toLowerCase() === activeTab);
    
    // Filter by search term
    const matchesSearch = 
      auction.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      auction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (auction.sellerName && auction.sellerName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesTab && matchesSearch;
  }) : [];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Buyer Table</h1>
          <p className="text-gray-400">
            Browse and bid on available items in real-time.
          </p>
        </div>
        
        <AuctionFilters 
          searchTerm={searchTerm}
          activeTab={activeTab}
          onSearchChange={setSearchTerm}
          onTabChange={setActiveTab}
        />
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-art-purple" />
          </div>
        ) : filteredAuctions.length === 0 ? (
          <Card className="art-card flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-art-purple/50 mb-4" />
            <h3 className="text-xl font-medium mb-2">No auctions found</h3>
            <p className="text-gray-400">
              Try adjusting your search or filters to see more results.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAuctions.map((auction: Auction) => (
              <AuctionCard
                key={auction.id}
                auction={auction}
                bidAmount={bidAmounts[auction.id] || null}
                onBidChange={handleBidChange}
                isBidding={isBidding}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Buyer;
