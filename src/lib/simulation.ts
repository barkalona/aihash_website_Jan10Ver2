interface NetworkStats {
  difficulty: number;
  blockReward: number;
  networkHashrate: number;
  blockTime: number;
}

interface PowerCosts {
  kwhPrice: number;
  efficiency: number;
  maintenanceCost: number;
}

interface MarketPrices {
  [key: string]: number; // cryptocurrency prices in USD
}

export class MiningSimulator {
  private static instance: MiningSimulator;
  private networkStats: Map<string, NetworkStats> = new Map();
  private marketPrices: MarketPrices = {};
  private updateInterval: number;

  private constructor() {
    this.updateInterval = setInterval(() => this.updateStats(), 60000);
    this.updateStats();
  }

  static getInstance(): MiningSimulator {
    if (!MiningSimulator.instance) {
      MiningSimulator.instance = new MiningSimulator();
    }
    return MiningSimulator.instance;
  }

  private async updateStats() {
    try {
      // Fetch current network stats and market prices
      // This would typically come from external APIs
      this.networkStats.set('SHA256', {
        difficulty: 55.849e12,
        blockReward: 6.25,
        networkHashrate: 512e18,
        blockTime: 600
      });

      this.marketPrices = {
        BTC: 43000,
        ETH: 2200
      };
    } catch (error) {
      console.error('Error updating mining stats:', error);
    }
  }

  calculateProfitability(params: {
    algorithm: string;
    hashPower: number;
    powerCosts: PowerCosts;
    duration: number;
  }) {
    const { algorithm, hashPower, powerCosts, duration } = params;
    const stats = this.networkStats.get(algorithm);
    
    if (!stats) {
      throw new Error(`No stats available for algorithm: ${algorithm}`);
    }

    // Calculate expected mining rewards
    const hashShareRatio = hashPower / stats.networkHashrate;
    const blocksPerDay = (86400 / stats.blockTime);
    const dailyRewards = blocksPerDay * stats.blockReward * hashShareRatio;

    // Calculate power costs
    const dailyPowerConsumption = (hashPower * powerCosts.efficiency) / 1000; // in kWh
    const dailyPowerCost = dailyPowerConsumption * powerCosts.kwhPrice;
    const dailyMaintenanceCost = powerCosts.maintenanceCost;

    // Calculate profitability
    const dailyRevenue = dailyRewards * this.marketPrices.BTC;
    const dailyCosts = dailyPowerCost + dailyMaintenanceCost;
    const dailyProfit = dailyRevenue - dailyCosts;

    return {
      dailyRevenue,
      dailyCosts,
      dailyProfit,
      projectedProfit: dailyProfit * (duration / 86400),
      roi: (dailyProfit * (duration / 86400)) / (dailyCosts * (duration / 86400)) * 100,
      powerConsumption: dailyPowerConsumption,
      rewardsEstimate: dailyRewards
    };
  }

  getMarketPrices() {
    return { ...this.marketPrices };
  }

  getNetworkStats(algorithm: string) {
    return this.networkStats.get(algorithm);
  }

  cleanup() {
    clearInterval(this.updateInterval);
  }
}