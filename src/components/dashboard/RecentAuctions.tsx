
import React from "react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { auctionsAPI } from "@/services/api";
import { Link } from "react-router-dom";
import AuctionCardSkeleton from "../auctions/AuctionCardSkeleton";
import AuctionCard from "../auctions/AuctionCard";

const RecentAuctions: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["recent-auctions"],
    queryFn: async () => {
      try {
        const response = await auctionsAPI.getAll();
        const auctionsData = Array.isArray(response.data) ? response.data : [];
        return auctionsData.slice(0, 3); // Get only 3 most recent auctions
      } catch (error) {
        console.error("Error fetching recent auctions:", error);
        return [];
      }
    }
  });

  // Ensure auctions is always an array
  const auctions = Array.isArray(data) ? data : [];

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Recently Added</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <AuctionCardSkeleton key={item} />
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
          <AuctionCard key={auction.id} auction={auction} />
        ))}
      </div>
    </div>
  );
};

export default RecentAuctions;
