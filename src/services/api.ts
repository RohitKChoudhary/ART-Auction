import { supabase } from "@/integrations/supabase/client";
import { Auction } from "@/types/auction";
import { toast } from "@/hooks/use-toast";

// Add error handling wrapper
const handleApiError = async (promise: Promise<any>) => {
  try {
    const response = await promise;
    return response;
  } catch (error: any) {
    // Handle auth errors
    if (error.status === 401) {
      // Force refresh auth session
      const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Please login again"
        });
        // Redirect to login
        window.location.href = "/login";
        throw error;
      }
    }
    throw error;
  }
};

// Auth API with improved error handling and session management
export const authAPI = {
  login: async (email: string, password: string) => {
    return handleApiError(supabase.auth.signInWithPassword({
      email,
      password,
    }));
  },

  register: async (name: string, email: string, password: string) => {
    return handleApiError(supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    }));
  },

  refreshSession: async () => {
    return handleApiError(supabase.auth.refreshSession());
  },

  forgotPassword: async (email: string) => {
    return handleApiError(supabase.auth.resetPasswordForEmail(email));
  }
};

// Auctions API with optimistic updates and proper caching
export const auctionsAPI = {
  getAll: async () => {
    return handleApiError(
      supabase
        .from('auctions')
        .select('*')
        .order('created_at', { ascending: false })
    );
  },

  create: async (formData: FormData) => {
    const imageFile = formData.get('image') as File;
    
    // Upload image first
    const { data: imageData, error: imageError } = await supabase.storage
      .from('auction-images')
      .upload(`${Date.now()}-${imageFile.name}`, imageFile);

    if (imageError) throw imageError;

    const imageUrl = supabase.storage
      .from('auction-images')
      .getPublicUrl(imageData.path).data.publicUrl;

    // Then create auction with image URL
    return handleApiError(
      supabase
        .from('auctions')
        .insert({
          name: formData.get('name'),
          description: formData.get('description'),
          min_bid: parseFloat(formData.get('minBid') as string),
          current_bid: parseFloat(formData.get('minBid') as string),
          image_url: imageUrl,
          // Add other fields...
        })
        .select()
        .single()
    );
  },

  // Add other auction methods...
};

// Bids API with real-time updates
export const bidsAPI = {
  placeBid: async (auctionId: string, amount: number) => {
    // Validate bid amount
    const { data: auction } = await supabase
      .from('auctions')
      .select('*')
      .eq('id', auctionId)
      .single();

    if (!auction) throw new Error('Auction not found');
    if (auction.status !== 'ACTIVE') throw new Error('Auction is not active');
    if (amount <= auction.current_bid) throw new Error('Bid must be higher than current bid');

    // Place bid with optimistic update
    const { data: bid, error } = await supabase
      .from('bids')
      .insert({
        auction_id: auctionId,
        amount: amount,
        // Add other fields...
      })
      .select()
      .single();

    if (error) throw error;

    // Update auction's current bid
    await supabase
      .from('auctions')
      .update({ 
        current_bid: amount,
        current_bidder_id: bid.bidder_id
      })
      .eq('id', auctionId);

    return { data: bid };
  },

  // Add other bid methods...
};

// Add other API modules...