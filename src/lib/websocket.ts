import { RealtimeChannel, createClient } from '@supabase/supabase-js';
import { rateLimit } from './rateLimit';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface ChannelSubscription {
  channel: RealtimeChannel;
  listeners: number;
}

class WebSocketManager {
  private channels: Map<string, ChannelSubscription> = new Map();

  // Subscribe to listing updates
  subscribeToListing(listingId: string, callback: (payload: any) => void) {
    const channelName = `listing:${listingId}`;
    let subscription = this.channels.get(channelName);

    if (!subscription) {
      const channel = supabase.channel(channelName)
        .on('postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'hash_power_listings',
            filter: `id=eq.${listingId}`
          },
          (payload) => callback(payload)
        )
        .subscribe();

      subscription = { channel, listeners: 0 };
      this.channels.set(channelName, subscription);
    }

    subscription.listeners++;
    return () => this.unsubscribe(channelName);
  }

  // Subscribe to price updates
  subscribeToPriceUpdates(callback: (payload: any) => void) {
    const channelName = 'price_updates';
    let subscription = this.channels.get(channelName);

    if (!subscription) {
      const channel = supabase.channel(channelName)
        .on('postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'price_history'
          },
          (payload) => callback(payload)
        )
        .subscribe();

      subscription = { channel, listeners: 0 };
      this.channels.set(channelName, subscription);
    }

    subscription.listeners++;
    return () => this.unsubscribe(channelName);
  }

  // Subscribe to order status updates
  subscribeToOrderUpdates(orderId: string, callback: (payload: any) => void) {
    const channelName = `order:${orderId}`;
    let subscription = this.channels.get(channelName);

    if (!subscription) {
      const channel = supabase.channel(channelName)
        .on('postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders',
            filter: `id=eq.${orderId}`
          },
          (payload) => callback(payload)
        )
        .subscribe();

      subscription = { channel, listeners: 0 };
      this.channels.set(channelName, subscription);
    }

    subscription.listeners++;
    return () => this.unsubscribe(channelName);
  }

  // Subscribe to matching updates
  subscribeToMatching(requestId: string, callback: (payload: any) => void) {
    const channelName = `matching:${requestId}`;
    let subscription = this.channels.get(channelName);

    if (!subscription) {
      const channel = supabase.channel(channelName)
        .on('postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'matching_results',
            filter: `request_id=eq.${requestId}`
          },
          (payload) => callback(payload)
        )
        .subscribe();

      subscription = { channel, listeners: 0 };
      this.channels.set(channelName, subscription);
    }

    subscription.listeners++;
    return () => this.unsubscribe(channelName);
  }

  private unsubscribe(channelName: string) {
    const subscription = this.channels.get(channelName);
    if (subscription) {
      subscription.listeners--;
      if (subscription.listeners === 0) {
        subscription.channel.unsubscribe();
        this.channels.delete(channelName);
      }
    }
  }
}

// Export a singleton instance
export const websocketManager = new WebSocketManager();