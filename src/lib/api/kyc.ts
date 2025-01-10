import { supabase } from '../supabase';
import type { Database } from '../database.types';

type KYCVerification = Database['public']['Tables']['kyc_verifications']['Row'];

export const kyc = {
  async submitVerification(userId: string, data: {
    verificationType: string;
    documents: Record<string, any>;
  }) {
    const { data: verification, error } = await supabase
      .from('kyc_verifications')
      .insert({
        user_id: userId,
        verification_type: data.verificationType,
        verification_data: data.documents,
        status: 'pending',
      })
      .select()
      .single();
    return { data: verification, error };
  },

  async getVerificationStatus(userId: string) {
    const { data, error } = await supabase
      .from('kyc_verifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    return { data, error };
  },
};