import { useState, useEffect } from 'react';
import { MarketDataManager } from '../lib/simulation/market';

export function useMarketData(symbol?: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const manager = MarketDataManager.getInstance();
    setLoading(true);

    if (symbol) {
      setData(manager.getMarketData(symbol));
    } else {
      setData(manager.getAllMarketData());
    }
    setLoading(false);

    const unsubscribe = manager.subscribe((marketData) => {
      if (symbol) {
        if (marketData.symbol === symbol) {
          setData(marketData);
        }
      } else {
        setData(manager.getAllMarketData());
      }
    });

    return unsubscribe;
  }, [symbol]);

  return { data, loading };
}