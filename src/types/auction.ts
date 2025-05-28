
export interface Auction {
  id: string;
  name: string;
  description: string;
  seller_id: string;
  seller_name: string;
  min_bid: number;
  current_bid: number;
  current_bidder_id?: string;
  current_bidder_name?: string;
  image_url?: string;
  status: string; // Changed from specific union to string to match Supabase
  category?: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export interface AuctionRequest {
  name: string;
  description: string;
  minBid: number;
  durationHours: number;
  category?: string;
}

export interface BidRequest {
  auctionId: string;
  amount: number;
}
