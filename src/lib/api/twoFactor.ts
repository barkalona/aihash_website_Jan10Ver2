import { supabase } from '../supabase';

export const twoFactor = {
  async enable2FA(userId: string) {
    const { data, error } = await supabase.rpc('generate_totp_secret', {
      user_id: userId
    });
    
    if (error) throw error;
    return data;
  },

  async verify2FA(userId: string, token: string) {
    const { data, error } = await supabase.rpc('verify_totp', {
      user_id: userId,
      token: token
    });
    
    if (error) throw error;
    return data;
  },

  async validate2FA(userId: string, token: string) {
    const { data, error } = await supabase.rpc('validate_totp', {
      user_id: userId,
      token: token
    });
    
    if (error) throw error;
    return data;
  },

  async disable2FA(userId: string, token: string) {
    const { data, error } = await supabase.rpc('disable_totp', {
      user_id: userId,
      token: token
    });
    
    if (error) throw error;
    return data;
  }
};