
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronUp, Clock, Loader2 } from "lucide-react";
import { Auction } from "@/types/auction";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bidsAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface AuctionCardProps {
  auction: Auction;
  bidAmount: number | null;
  onBidChange: (id: string, value: string) => void;
  isBidding: boolean;
}

const AuctionCard: React.FC<AuctionCardProps> = ({ 
  auction, 
  bidAmount, 
  onBidChange,
  isBidding
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
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
  
  const handleBidSubmit = () => {
    if (!bidAmount) {
      toast({
        variant: "destructive",
        title: "Invalid bid",
        description: "Please enter a valid bid amount.",
      });
      return;
    }
    
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
    onBidChange(auction.id, "");
  };
  
  return (
    <Card className="art-card flex flex-col">
      <div className="aspect-square bg-art-charcoal rounded-md overflow-hidden mb-4">
        <img 
          src={auction.imageUrl || "https://via.placeholder.com/500?text=No+Image"} 
          alt={auction.name}
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
            value={bidAmount || ""}
            onChange={(e) => onBidChange(auction.id, e.target.value)}
            className="art-input"
          />
          <Button 
            className="bg-art-purple hover:bg-art-purple-dark text-white"
            onClick={handleBidSubmit}
            disabled={bidMutation.isPending || isBidding}
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
  );
};

export default AuctionCard;
