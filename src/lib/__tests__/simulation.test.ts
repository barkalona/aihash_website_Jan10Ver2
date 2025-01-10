import { MiningSimulator } from '../simulation';
import { MarketDataManager } from '../simulation/market';
import { RiskAnalyzer } from '../simulation/risk';

describe('Mining Simulation Tests', () => {
  test('calculates profitability correctly', () => {
    const simulator = MiningSimulator.getInstance();
    const result = simulator.calculateProfitability({
      algorithm: 'SHA256',
      hashPower: 100,
      powerCosts: {
        kwhPrice: 0.10,
        efficiency: 0.85,
        maintenanceCost: 5
      },
      duration: 86400
    });

    expect(result.dailyRevenue).toBeDefined();
    expect(result.dailyCosts).toBeDefined();
    expect(result.dailyProfit).toBeDefined();
    expect(result.roi).toBeGreaterThan(0);
  });
});

describe('Market Data Tests', () => {
  test('receives market updates', (done) => {
    const manager = MarketDataManager.getInstance();
    
    manager.subscribe((data) => {
      expect(data.symbol).toBeDefined();
      expect(data.price).toBeGreaterThan(0);
      done();
    });
  });
});

describe('Risk Analysis Tests', () => {
  test('analyzes risk profile correctly', () => {
    const analyzer = RiskAnalyzer.getInstance();
    const riskProfile = analyzer.analyzeRisk({
      marketVolatility: 0.15,
      networkStability: 0.95,
      hardwareReliability: 0.90,
      regulatoryScore: 0.85,
      historicalPerformance: 0.88
    });

    expect(riskProfile.totalRisk).toBeLessThan(100);
    expect(riskProfile.recommendations).toBeInstanceOf(Array);
  });
});