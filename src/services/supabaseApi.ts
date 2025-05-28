
import { supabase } from "@/integrations/supabase/client";
import { Auction, AuctionRequest } from "@/types/auction";

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    return {
      data: {
        id: data.user.id,
        name: profile?.name || data.user.email,
        email: data.user.email,
        token: data.session?.access_token,
        role: profile?.role || 'user'
      }
    };
  },
  
  register: async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });
    
    if (error) throw error;
    
    return {
      data: {
        id: data.user?.id,
        name: name,
        email: email,
        token: data.session?.access_token,
        role: 'user'
      }
    };
  },
  
  forgotPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return { data: "Password reset instructions sent to your email." };
  },
};

// Auctions API
export const auctionsAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('auctions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data: data || [] };
  },
  
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('auctions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { data };
  },
  
  getSellerAuctions: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('auctions')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data: data || [] };
  },
  
  create: async (formData: FormData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', user.id)
      .single();
    
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const minBid = parseFloat(formData.get('minBid') as string);
    const durationHours = parseInt(formData.get('durationHours') as string);
    const category = formData.get('category') as string;
    
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + durationHours);
    
    const { data, error } = await supabase
      .from('auctions')
      .insert({
        name,
        description,
        seller_id: user.id,
        seller_name: profile?.name || user.email || 'Unknown',
        min_bid: minBid,
        current_bid: minBid,
        category,
        end_time: endTime.toISOString(),
        image_url: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500"
      })
      .select()
      .single();
    
    if (error) throw error;
    return { data };
  },
  
  cancel: async (id: string) => {
    const { error } = await supabase
      .from('auctions')
      .update({ status: 'CANCELLED' })
      .eq('id', id);
    
    if (error) throw error;
    return { data: "Auction cancelled successfully" };
  },
};

// Bids API
export const bidsAPI = {
  getByAuction: async (auctionId: string) => {
    const { data, error } = await supabase
      .from('bids')
      .select('*')
      .eq('auction_id', auctionId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data: data || [] };
  },
  
  getUserBids: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('bids')
      .select('*')
      .eq('bidder_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data: data || [] };
  },
  
  placeBid: async (auctionId: string, amount: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', user.id)
      .single();
    
    // Get auction to validate
    const { data: auction } = await supabase
      .from('auctions')
      .select('*')
      .eq('id', auctionId)
      .single();
    
    if (!auction) throw new Error('Auction not found');
    if (auction.status !== 'ACTIVE') throw new Error('This auction is not active');
    if (new Date(auction.end_time) < new Date()) throw new Error('This auction has ended');
    if (amount <= auction.current_bid) throw new Error('Bid amount must be higher than current bid');
    if (auction.seller_id === user.id) throw new Error('You cannot bid on your own item');
    
    const { data, error } = await supabase
      .from('bids')
      .insert({
        auction_id: auctionId,
        bidder_id: user.id,
        bidder_name: profile?.name || user.email || 'Unknown',
        amount: amount,
      })
      .select()
      .single();
    
    if (error) throw error;
    return { data };
  },
};

// Users API
export const usersAPI = {
  getProfile: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) throw error;
    return { data };
  },
  
  getAllUsers: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data: data || [] };
  },
  
  toggleUserStatus: async (id: string) => {
    // This would require additional logic in a real app
    throw new Error('Feature not implemented');
  },
  
  promoteToAdmin: async (id: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', id);
    
    if (error) throw error;
    return { data: "User promoted to admin" };
  },
  
  updateProfile: async (updates: { name?: string }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) throw error;
    return { data };
  },
};

// Messages API (placeholder for future implementation)
export const messagesAPI = {
  getAll: async () => {
    return { data: [] };
  },
  
  getUnread: async () => {
    return { data: [] };
  },
  
  markAsRead: async (id: string) => {
    return { data: "Message marked as read" };
  },
  
  create: async (messageData: {
    recipientId: string;
    content: string;
    type: string;
    auctionId?: string;
  }) => {
    return { data: "Message created" };
  },
};
