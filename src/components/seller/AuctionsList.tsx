
import { useState, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { auctionsAPI } from "@/services/api";
import { Auction } from "@/types/auction";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AuctionsList = () => {
  const [sellerAuctions, setSellerAuctions] = useState<Auction[]>([]);

  // Fetch seller's auctions
  const { data, isLoading, error } = useQuery({
    queryKey: ["seller-auctions"],
    queryFn: async () => {
      try {
        const response = await auctionsAPI.getSellerAuctions();
        return response.data;
      } catch (error) {
        console.error("Error fetching seller auctions:", error);
        return [];
      }
    }
  });

  // Update local state when data changes
  useEffect(() => {
    if (data) {
      setSellerAuctions(Array.isArray(data) ? data : []);
    }
  }, [data]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "Invalid date";
    }
  };

  if (error) {
    console.error("Error in AuctionsList:", error);
    return (
      <Card className="border-art-purple/30 bg-art-dark-blue">
        <CardContent className="py-8">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">Error loading auctions</h3>
            <p className="text-gray-400">
              There was a problem fetching your auctions. Please try again later.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-art-purple/30 bg-art-dark-blue">
      <CardHeader>
        <CardTitle>My Auction Listings</CardTitle>
        <CardDescription>
          Manage your active and past auction listings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-art-purple" />
          </div>
        ) : !sellerAuctions || sellerAuctions.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="mx-auto h-12 w-12 text-art-purple/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No auctions found</h3>
            <p className="text-gray-400">
              You haven't listed any items for auction yet. Create your first listing to get started!
            </p>
          </div>
        ) : (
          <Table>
            <TableCaption>A list of your auction items.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Item</TableHead>
                <TableHead className="hidden md:table-cell">Current Bid</TableHead>
                <TableHead className="hidden md:table-cell">Min Bid</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sellerAuctions.map((auction) => (
                <TableRow key={auction.id}>
                  <TableCell className="font-medium">{auction.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    ${auction.current_bid}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    ${auction.min_bid}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        auction.status === "ACTIVE" ? "bg-green-600" : 
                        auction.status === "ENDED" ? "bg-blue-600" :
                        "bg-red-600"
                      }
                    >
                      {auction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDate(auction.end_time)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        toast({
                          title: "View Details",
                          description: "Auction details view is coming soon."
                        });
                      }}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AuctionsList;
