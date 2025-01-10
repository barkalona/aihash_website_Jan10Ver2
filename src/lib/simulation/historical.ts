import { supabase } from '../supabase';

export interface HistoricalData {
  timestamp: string;
  algorithm: string;
  networkHashrate: number;
  difficulty: number;
  blockReward: number;
  profitability: number;
  energyEfficiency: number;
}

export class HistoricalDataManager {
  private static instance: HistoricalDataManager;

  private constructor() {}

  static getInstance(): HistoricalDataManager {
    if (!HistoricalDataManager.instance) {
      HistoricalDataManager.instance = new HistoricalDataManager();
    }
    return HistoricalDataManager.instance;
  }

  async getHistoricalData(params: {
    algorithm: string;
    startDate: string;
    endDate: string;
  }): Promise<HistoricalData[]> {
    const { data, error } = await supabase
      .from('historical_mining_data')
      .select('*')
      .eq('algorithm', params.algorithm)
      .gte('timestamp', params.startDate)
      .lte('timestamp', params.endDate)
      .order('timestamp', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async storeHistoricalData(data: Omit<HistoricalData, 'id'>): Promise<void> {
    const { error } = await supabase
      .from('historical_mining_data')
      .insert(data);

    if (error) throw error;
  }

  async getAggregatedMetrics(algorithm: string): Promise<{
    avgProfitability: number;
    avgEfficiency: number;
    volatility: number;
  }> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await supabase
      .from('historical_mining_data')
      .select('profitability, energy_efficiency')
      .eq('algorithm', algorithm)
      .gte('timestamp', thirtyDaysAgo.toISOString());

    if (error) throw error;
    if (!data?.length) return { avgProfitability: 0, avgEfficiency: 0, volatility: 0 };

    const profitabilities = data.map(d => d.profitability);
    const efficiencies = data.map(d => d.energy_efficiency);

    return {
      avgProfitability: this.calculateAverage(profitabilities),
      avgEfficiency: this.calculateAverage(efficiencies),
      volatility: this.calculateVolatility(profitabilities)
    };
  }

  private calculateAverage(values: number[]): number {
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  private calculateVolatility(values: number[]): number {
    const avg = this.calculateAverage(values);
    const squaredDiffs = values.map(v => Math.pow(v - avg, 2));
    const variance = this.calculateAverage(squaredDiffs);
    return Math.sqrt(variance);
  }
}