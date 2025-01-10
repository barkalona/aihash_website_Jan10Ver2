import { websocketManager } from '../websocket';

interface MarketData {
  symbol: string;
  price: number;
  volume24h: number;
  change24h: number;
  lastUpdate: string;
}

export class MarketDataManager {
  private static instance: MarketDataManager;
  private marketData: Map<string, MarketData> = new Map();
  private subscribers: Set<(data: MarketData) => void> = new Set();

  private constructor() {
    this.initializeWebSocket();
  }

  static getInstance(): MarketDataManager {
    if (!MarketDataManager.instance) {
      MarketDataManager.instance = new MarketDataManager();
    }
    return MarketDataManager.instance;
  }

  private initializeWebSocket() {
    websocketManager.subscribeToPriceUpdates((payload) => {
      const data = this.parseMarketData(payload);
      this.updateMarketData(data);
    });
  }

  private parseMarketData(payload: any): MarketData {
    return {
      symbol: payload.symbol,
      price: parseFloat(payload.price),
      volume24h: parseFloat(payload.volume_24h),
      change24h: parseFloat(payload.change_24h),
      lastUpdate: new Date().toISOString()
    };
  }

  private updateMarketData(data: MarketData) {
    this.marketData.set(data.symbol, data);
    this.notifySubscribers(data);
  }

  private notifySubscribers(data: MarketData) {
    this.subscribers.forEach(callback => callback(data));
  }

  subscribe(callback: (data: MarketData) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  getMarketData(symbol: string): MarketData | undefined {
    return this.marketData.get(symbol);
  }

  getAllMarketData(): MarketData[] {
    return Array.from(this.marketData.values());
  }
}