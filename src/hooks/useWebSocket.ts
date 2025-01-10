import { useEffect, useCallback } from 'react';
import { websocketManager } from '../lib/websocket';
import { rateLimit } from '../lib/rateLimit';

export function useWebSocket() {
  const subscribeToPrices = useCallback((callback: (data: any) => void) => {
    return websocketManager.subscribeToPriceUpdates(async (payload) => {
      const canProcess = await rateLimit.websocket.checkLimit('price_updates');
      if (canProcess) {
        callback(payload);
      }
    });
  }, []);

  const subscribeToListing = useCallback((listingId: string, callback: (data: any) => void) => {
    return websocketManager.subscribeToListing(listingId, async (payload) => {
      const canProcess = await rateLimit.websocket.checkLimit(`listing:${listingId}`);
      if (canProcess) {
        callback(payload);
      }
    });
  }, []);

  const subscribeToOrder = useCallback((orderId: string, callback: (data: any) => void) => {
    return websocketManager.subscribeToOrderUpdates(orderId, async (payload) => {
      const canProcess = await rateLimit.websocket.checkLimit(`order:${orderId}`);
      if (canProcess) {
        callback(payload);
      }
    });
  }, []);

  return {
    subscribeToPrices,
    subscribeToListing,
    subscribeToOrder
  };
}