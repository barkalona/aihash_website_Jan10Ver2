export interface RiskProfile {
  marketRisk: number;
  operationalRisk: number;
  technicalRisk: number;
  regulatoryRisk: number;
  totalRisk: number;
  recommendations: string[];
}

export class RiskAnalyzer {
  private static instance: RiskAnalyzer;

  private constructor() {}

  static getInstance(): RiskAnalyzer {
    if (!RiskAnalyzer.instance) {
      RiskAnalyzer.instance = new RiskAnalyzer();
    }
    return RiskAnalyzer.instance;
  }

  analyzeRisk(params: {
    marketVolatility: number;
    networkStability: number;
    hardwareReliability: number;
    regulatoryScore: number;
    historicalPerformance: number;
  }): RiskProfile {
    const marketRisk = this.calculateMarketRisk(params.marketVolatility);
    const operationalRisk = this.calculateOperationalRisk(params.hardwareReliability);
    const technicalRisk = this.calculateTechnicalRisk(params.networkStability);
    const regulatoryRisk = this.calculateRegulatoryRisk(params.regulatoryScore);

    const totalRisk = this.calculateTotalRisk({
      marketRisk,
      operationalRisk,
      technicalRisk,
      regulatoryRisk
    });

    return {
      marketRisk,
      operationalRisk,
      technicalRisk,
      regulatoryRisk,
      totalRisk,
      recommendations: this.generateRecommendations({
        marketRisk,
        operationalRisk,
        technicalRisk,
        regulatoryRisk
      })
    };
  }

  private calculateMarketRisk(volatility: number): number {
    return Math.min(100, volatility * 100);
  }

  private calculateOperationalRisk(reliability: number): number {
    return Math.max(0, 100 - reliability * 100);
  }

  private calculateTechnicalRisk(stability: number): number {
    return Math.max(0, 100 - stability * 100);
  }

  private calculateRegulatoryRisk(score: number): number {
    return Math.max(0, 100 - score * 100);
  }

  private calculateTotalRisk(risks: {
    marketRisk: number;
    operationalRisk: number;
    technicalRisk: number;
    regulatoryRisk: number;
  }): number {
    const weights = {
      market: 0.4,
      operational: 0.3,
      technical: 0.2,
      regulatory: 0.1
    };

    return (
      risks.marketRisk * weights.market +
      risks.operationalRisk * weights.operational +
      risks.technicalRisk * weights.technical +
      risks.regulatoryRisk * weights.regulatory
    );
  }

  private generateRecommendations(risks: {
    marketRisk: number;
    operationalRisk: number;
    technicalRisk: number;
    regulatoryRisk: number;
  }): string[] {
    const recommendations: string[] = [];

    if (risks.marketRisk > 70) {
      recommendations.push('Consider hedging strategies to mitigate high market volatility');
    }

    if (risks.operationalRisk > 60) {
      recommendations.push('Implement redundancy measures and enhance maintenance protocols');
    }

    if (risks.technicalRisk > 50) {
      recommendations.push('Upgrade hardware and optimize network connections');
    }

    if (risks.regulatoryRisk > 40) {
      recommendations.push('Review compliance measures and maintain documentation');
    }

    return recommendations;
  }
}