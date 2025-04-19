
import React from "react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { auctionsAPI } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

const RecentAuctions: React.FC = () => {
  const { data: auctions, isLoading } = useQuery({
    queryKey: ["recent-auctions"],
    queryFn: async () => {
      try {
        const response = await auctionsAPI.getAll();
        return response.data.slice(0, 3); // Get only 3 most recent auctions
      } catch (error) {
        console.error("Error fetching recent auctions:", error);
        return [];
      }
    }
  });

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Recently Added</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="art-card p-4">
              <div className="aspect-square bg-art-charcoal rounded-md overflow-hidden mb-4">
                <Skeleton className="w-full h-full" />
              </div>
              <Skeleton className="h-6 w-2/3 mb-2" />
              <div className="flex justify-between text-sm mb-3">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <div className="flex justify-between text-sm">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!auctions || auctions.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Recently Added</h2>
        <Card className="art-card p-6 text-center">
          <p className="text-gray-400">No auctions have been added yet.</p>
          <Link to="/seller" className="text-art-purple hover:text-art-purple-light mt-2 inline-block">
            Create your first auction
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Recently Added</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {auctions.map((auction) => (
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
              <span className="font-medium">
                {new Date(auction.endTime) > new Date() ? 
                  `${Math.ceil((new Date(auction.endTime).getTime() - new Date().getTime()) / (1000 * 60 * 60))}h` : 
                  "Ended"}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecentAuctions;
