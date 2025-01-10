import { LRUCache } from 'lru-cache';

interface CacheOptions {
  maxSize: number;
  ttl: number;
}

export class SimulationCache {
  private static instance: SimulationCache;
  private cache: LRUCache<string, any>;

  private constructor(options: CacheOptions) {
    this.cache = new LRUCache({
      max: options.maxSize,
      ttl: options.ttl,
      updateAgeOnGet: true,
    });
  }

  static getInstance(options: CacheOptions = { maxSize: 1000, ttl: 300000 }): SimulationCache {
    if (!SimulationCache.instance) {
      SimulationCache.instance = new SimulationCache(options);
    }
    return SimulationCache.instance;
  }

  get(key: string): any | undefined {
    return this.cache.get(key);
  }

  set(key: string, value: any): void {
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }

  generateKey(params: Record<string, any>): string {
    return JSON.stringify(params);
  }
}