import { useState, useEffect } from 'react';
import { MiningSimulator } from '../lib/simulation';

export function useSimulation(params: {
  algorithm: string;
  hashPower: number;
  powerCosts: {
    kwhPrice: number;
    efficiency: number;
    maintenanceCost: number;
  };
  duration: number;
}) {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const simulator = MiningSimulator.getInstance();

    try {
      const profitability = simulator.calculateProfitability(params);
      setResults(profitability);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error calculating profitability');
    } finally {
      setLoading(false);
    }

    // Cleanup
    return () => {
      simulator.cleanup();
    };
  }, [params]);

  return { results, loading, error };
}