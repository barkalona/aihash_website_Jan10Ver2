import { useState, useEffect } from 'react';
import { HistoricalDataManager, type HistoricalData } from '../lib/simulation/historical';

export function useHistoricalData(params: {
  algorithm: string;
  startDate: string;
  endDate: string;
}) {
  const [data, setData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const historicalData = await HistoricalDataManager.getInstance().getHistoricalData(params);
        setData(historicalData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching historical data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  return { data, loading, error };
}