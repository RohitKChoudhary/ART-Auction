
import React from "react";
import { Card } from "@/components/ui/card";
import { Auction } from "@/types/auction";

interface AuctionCardProps {
  auction: Auction;
}

const AuctionCard: React.FC<AuctionCardProps> = ({ auction }) => {
  const calculateTimeLeft = (endTime: string) => {
    if (new Date(endTime) > new Date()) {
      return `${Math.ceil((new Date(endTime).getTime() - new Date().getTime()) / (1000 * 60 * 60))}h`;
    } else {
      return "Ended";
    }
  };

  return (
    <Card key={auction.id} className="art-card">
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
      <h3 className="text-lg font-medium mb-2">{auction.name}</h3>
      <div className="flex justify-between text-sm mb-3">
        <span className="text-gray-400">Current Bid</span>
        <span className="font-medium text-art-purple">${auction.currentBid}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Ends In</span>
        <span className="font-medium">{calculateTimeLeft(auction.endTime)}</span>
      </div>
    </Card>
  );
};

export default AuctionCard;
