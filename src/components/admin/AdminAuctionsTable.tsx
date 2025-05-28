
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Auction } from "@/types/auction";

interface AdminAuctionsTableProps {
  auctions: Auction[];
}

const AdminAuctionsTable: React.FC<AdminAuctionsTableProps> = ({ auctions }) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "Invalid date";
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "ENDED":
        return "secondary";
      case "CANCELLED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  if (!auctions || auctions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No auctions found.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item Name</TableHead>
          <TableHead>Seller</TableHead>
          <TableHead>Current Bid</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {auctions.map((auction) => (
          <TableRow key={auction.id}>
            <TableCell className="font-medium">{auction.name}</TableCell>
            <TableCell>{auction.seller_name}</TableCell>
            <TableCell>${auction.current_bid.toLocaleString()}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(auction.status)}>
                {auction.status}
              </Badge>
            </TableCell>
            <TableCell>{formatDate(auction.end_time)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button size="sm" variant="outline">
                  View Details
                </Button>
                {auction.status === "ACTIVE" && (
                  <Button size="sm" variant="destructive">
                    Cancel
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AdminAuctionsTable;
