export interface RiskMetrics {
  volatilityScore: number;
  reliabilityScore: number;
  marketRisk: number;
  technicalRisk: number;
  overallRisk: number;
}

export interface AdvancedMetrics {
  hashEfficiency: number;
  networkDifficulty: number;
  marketShare: number;
  competitiveIndex: number;
  sustainabilityScore: number;
}

export class MetricsCalculator {
  calculateRiskMetrics(params: {
    historicalVolatility: number;
    networkStability: number;
    marketConditions: number;
    technicalFactors: number;
  }): RiskMetrics {
    const { historicalVolatility, networkStability, marketConditions, technicalFactors } = params;

    const volatilityScore = Math.max(0, Math.min(100, 100 - historicalVolatility * 100));
    const reliabilityScore = networkStability * 100;
    const marketRisk = (1 - marketConditions) * 100;
    const technicalRisk = (1 - technicalFactors) * 100;

    const overallRisk = (
      volatilityScore * 0.3 +
      reliabilityScore * 0.3 +
      (100 - marketRisk) * 0.2 +
      (100 - technicalRisk) * 0.2
    );

    return {
      volatilityScore,
      reliabilityScore,
      marketRisk,
      technicalRisk,
      overallRisk
    };
  }

  calculateAdvancedMetrics(params: {
    actualHashRate: number;
    theoreticalHashRate: number;
    networkHashRate: number;
    difficulty: number;
    energyEfficiency: number;
  }): AdvancedMetrics {
    const {
      actualHashRate,
      theoreticalHashRate,
      networkHashRate,
      difficulty,
      energyEfficiency
    } = params;

    const hashEfficiency = (actualHashRate / theoreticalHashRate) * 100;
    const marketShare = (actualHashRate / networkHashRate) * 100;
    const competitiveIndex = this.calculateCompetitiveIndex(hashEfficiency, marketShare);
    const sustainabilityScore = energyEfficiency * 100;

    return {
      hashEfficiency,
      networkDifficulty: difficulty,
      marketShare,
      competitiveIndex,
      sustainabilityScore
    };
  }

  private calculateCompetitiveIndex(hashEfficiency: number, marketShare: number): number {
    return (hashEfficiency * 0.7 + marketShare * 0.3);
  }
}