import { supabase } from '../supabase';
import type { Database } from '../database.types';

type Listing = Database['public']['Tables']['hash_power_listings']['Row'];
type Order = Database['public']['Tables']['orders']['Row'];

export const marketplace = {
  // Listings
  async getListings(filters?: {
    algorithm?: string;
    minHashPower?: number;
    maxHashPower?: number;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
  }) {
    let query = supabase
      .from('hash_power_listings')
      .select('*, seller_profiles(*)');

    if (filters) {
      if (filters.algorithm) {
        query = query.eq('algorithm', filters.algorithm);
      }
      if (filters.minHashPower) {
        query = query.gte('hash_power', filters.minHashPower);
      }
      if (filters.maxHashPower) {
        query = query.lte('hash_power', filters.maxHashPower);
      }
      if (filters.minPrice) {
        query = query.gte('price_per_th', filters.minPrice);
      }
      if (filters.maxPrice) {
        query = query.lte('price_per_th', filters.maxPrice);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
    }

    const { data, error } = await query;
    return { data, error };
  },

  async createListing(listing: Omit<Listing, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('hash_power_listings')
      .insert(listing)
      .select()
      .single();
    return { data, error };
  },

  // Orders
  async createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
    return { data, error };
  },

  async getUserOrders(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, hash_power_listings(*)')
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`);
    return { data, error };
  },

  // Reviews
  async createReview(review: {
    order_id: string;
    rating: number;
    comment?: string;
  }) {
    const { data, error } = await supabase
      .from('reviews')
      .insert(review)
      .select()
      .single();
    return { data, error };
  },

  // Price History
  async getPriceHistory(listingId: string) {
    const { data, error } = await supabase
      .from('price_history')
      .select('*')
      .eq('listing_id', listingId)
      .order('timestamp', { ascending: false });
    return { data, error };
  },
};