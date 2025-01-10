import { useState, useEffect } from 'react';
import { EnhancedMiningSimulator } from '../lib/simulation/enhanced-simulator';

export function useEnhancedSimulation(params: {
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
    const simulator = EnhancedMiningSimulator.getInstance();
    let mounted = true;

    const simulate = async () => {
      try {
        const simulationResults = await simulator.simulate(params);
        if (mounted) {
          setResults(simulationResults);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Error in simulation');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    simulate();

    return () => {
      mounted = false;
    };
  }, [params]);

  return { results, loading, error };
}