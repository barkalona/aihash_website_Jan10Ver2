import { supabase } from '../supabase';
import type { Database } from '../database.types';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type SellerProfile = Database['public']['Tables']['seller_profiles']['Row'];
type BuyerProfile = Database['public']['Tables']['buyer_profiles']['Row'];

export const profiles = {
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*, seller_profiles(*), buyer_profiles(*)')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  async updateUserProfile(userId: string, profile: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(profile)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  async createSellerProfile(profile: Omit<SellerProfile, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('seller_profiles')
      .insert(profile)
      .select()
      .single();
    return { data, error };
  },

  async createBuyerProfile(profile: Omit<BuyerProfile, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('buyer_profiles')
      .insert(profile)
      .select()
      .single();
    return { data, error };
  },

  async verifyWalletAddress(userId: string, address: string, blockchain: string) {
    const { data, error } = await supabase
      .from('wallet_addresses')
      .insert({
        user_id: userId,
        address,
        blockchain,
        is_verified: true,
        verification_date: new Date().toISOString(),
      })
      .select()
      .single();
    return { data, error };
  },
};