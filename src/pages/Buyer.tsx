
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronUp, Clock, AlertCircle, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { auctionsAPI, bidsAPI } from "@/services/api";

const Buyer: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [bidAmounts, setBidAmounts] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch active auctions
  const { data: auctions, isLoading } = useQuery({
    queryKey: ["active-auctions"],
    queryFn: async () => {
      try {
        const response = await auctionsAPI.getAll();
        return response.data || [];
      } catch (error) {
        console.error("Error fetching auctions:", error);
        return [];
      }
    }
  });

  // Bid mutation
  const bidMutation = useMutation({
    mutationFn: async ({ auctionId, amount }: { auctionId: string, amount: number }) => {
      return await bidsAPI.placeBid(auctionId, amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["active-auctions"] });
      queryClient.invalidateQueries({ queryKey: ["recent-auctions"] });
    },
    onError: (error) => {
      console.error("Bid error:", error);
      toast({
        variant: "destructive",
        title: "Bid Failed",
        description: "There was an error placing your bid. Please try again."
      });
    }
  });

  // Calculate time remaining
  const getTimeRemaining = (endTime: string) => {
    try {
      const total = Date.parse(endTime) - Date.now();
      if (total <= 0) return "Ended";
      
      const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
      const days = Math.floor(total / (1000 * 60 * 60 * 24));
      const minutes = Math.floor((total / 1000 / 60) % 60);
      
      if (days > 0) {
        return `${days}d ${hours}h`;
      }
      return `${hours}h ${minutes}m`;
    } catch (error) {
      return "Invalid date";
    }
  };

  const handleBidChange = (id: string, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setBidAmounts({ ...bidAmounts, [id]: numValue });
    }
  };

  const handleBidSubmit = (auction: any) => {
    const bidAmount = bidAmounts[auction.id] || 0;
    
    if (bidAmount <= auction.currentBid) {
      toast({
        variant: "destructive",
        title: "Bid too low",
        description: `Your bid must be higher than the current bid of $${auction.currentBid}`,
      });
      return;
    }
    
    // Place bid
    bidMutation.mutate({ auctionId: auction.id, amount: bidAmount });
    
    toast({
      title: "Bid placed!",
      description: `Your bid of $${bidAmount} for "${auction.name}" has been placed.`,
    });
    
    // Clear the input
    setBidAmounts({ ...bidAmounts, [auction.id]: 0 });
  };

  // Filter auctions based on active tab and search term
  const filteredAuctions = auctions ? auctions.filter(auction => {
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
        
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <Input
            className="max-w-sm art-input"
            placeholder="Search auctions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-art-charcoal">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="electronics">Electronics</TabsTrigger>
              <TabsTrigger value="collectibles">Collectibles</TabsTrigger>
              <TabsTrigger value="fashion">Fashion</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
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
            {filteredAuctions.map((auction) => (
              <Card key={auction.id} className="art-card flex flex-col">
                <div className="aspect-square bg-art-charcoal rounded-md overflow-hidden mb-4">
                  <img 
                    src={auction.imageUrl || "https://via.placeholder.com/500?text=No+Image"} 
                    alt={auction.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/500?text=No+Image";
                    }}
                  />
                </div>
                
                <CardHeader className="p-0 pb-3">
                  <CardTitle className="text-xl">{auction.name}</CardTitle>
                  <p className="text-sm text-art-purple">Seller: {auction.sellerName || "Unknown"}</p>
                </CardHeader>
                
                <CardContent className="p-0 flex-1">
                  <p className="text-gray-400 text-sm mb-4">{auction.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-400">Current Bid</p>
                      <p className="text-lg font-semibold text-art-purple">
                        ${auction.currentBid?.toLocaleString() || auction.minBid?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Ends In</p>
                      <p className="text-lg font-semibold flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {getTimeRemaining(auction.endTime)}
                      </p>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="p-0 pt-4">
                  <div className="w-full flex space-x-2">
                    <Input
                      type="number"
                      placeholder={`Min: $${(auction.currentBid || auction.minBid) + 1}`}
                      value={bidAmounts[auction.id] || ""}
                      onChange={(e) => handleBidChange(auction.id, e.target.value)}
                      className="art-input"
                    />
                    <Button 
                      className="bg-art-purple hover:bg-art-purple-dark text-white"
                      onClick={() => handleBidSubmit(auction)}
                      disabled={bidMutation.isPending}
                    >
                      {bidMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <ChevronUp className="h-4 w-4 mr-1" /> Bid
                        </>
                      )}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Buyer;
