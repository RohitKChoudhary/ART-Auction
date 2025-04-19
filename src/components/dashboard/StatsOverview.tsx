
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { auctionsAPI } from "@/services/api";

const StatsOverview: React.FC = () => {
  const { data: auctions, isLoading, error } = useQuery({
    queryKey: ["active-auctions"],
    queryFn: async () => {
      try {
        const response = await auctionsAPI.getAll();
        // Ensure we always return an array
        return Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error("Error fetching auction stats:", error);
        return [];
      }
    }
  });

  // Count metrics based on auctions data - ensure we handle undefined or null
  const activeAuctions = Array.isArray(auctions) 
    ? auctions.filter(auction => auction?.status === "ACTIVE").length 
    : 0;
  
  const totalAuctions = Array.isArray(auctions) ? auctions.length : 0;
  
  const highestBid = Array.isArray(auctions) 
    ? auctions.reduce((max, auction) => 
        Math.max(max, auction?.currentBid || 0), 0) 
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Auctions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeAuctions}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {totalAuctions > 0 
              ? `${Math.round((activeAuctions / totalAuctions) * 100)}% of total auctions` 
              : 'No auctions available'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Auctions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAuctions}</div>
          <p className="text-xs text-muted-foreground mt-1">
            All auctions from the platform
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Highest Bid</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${highestBid.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Highest bid across all auctions
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;
