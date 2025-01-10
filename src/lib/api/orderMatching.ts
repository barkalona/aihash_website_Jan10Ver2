import { supabase } from '../supabase';
import { websocketManager } from '../websocket';
import { errorHandler } from '../errors';

interface MatchingCriteria {
  algorithm: string;
  minHashPower: number;
  maxHashPower: number;
  maxPricePerTH: number;
  availability: {
    startTime: string;
    endTime: string;
  };
}

export const orderMatching = {
  // Find available mining rigs matching criteria
  async findMatches(criteria: MatchingCriteria) {
    const { data, error } = await supabase
      .from('hash_power_listings')
      .select(`
        *,
        seller_profiles(
          business_name,
          rating,
          total_sales
        )
      `)
      .eq('status', 'active')
      .eq('algorithm', criteria.algorithm)
      .gte('hash_power', criteria.minHashPower)
      .lte('hash_power', criteria.maxHashPower)
      .lte('price_per_th', criteria.maxPricePerTH)
      .containedBy('availability_window', `[${criteria.availability.startTime},${criteria.availability.endTime}]`);

    if (error) throw errorHandler.handle(error);
    return data;
  },

  // Place a matching request
  async placeMatchingRequest(userId: string, criteria: MatchingCriteria) {
    const { data, error } = await supabase
      .from('matching_requests')
      .insert({
        user_id: userId,
        criteria,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw errorHandler.handle(error);
    return data;
  },

  // Subscribe to matching updates
  subscribeToMatches(requestId: string, callback: (match: any) => void) {
    return websocketManager.subscribeToMatching(requestId, callback);
  }
};