
export interface Auction {
  id: string;
  name: string;
  description: string;
  sellerId: string;
  sellerName: string;
  minBid: number;
  currentBid: number;
  currentBidderId?: string;
  currentBidderName?: string;
  imageUrl?: string;
  status: "ACTIVE" | "ENDED" | "CANCELLED";
  category?: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}
