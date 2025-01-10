import { AppError } from '../errors';
import { ErrorCodes } from '../errors/codes';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  errorMessage?: string;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = {
      errorMessage: 'Too many requests. Please try again later.',
      ...config
    };
  }

  async checkLimit(key: string): Promise<void> {
    const now = Date.now();
    const entry = this.limits.get(key);

    if (!entry || now >= entry.resetTime) {
      this.limits.set(key, {
        count: 1,
        resetTime: now + this.config.windowMs
      });
      return;
    }

    if (entry.count >= this.config.maxRequests) {
      const timeToReset = entry.resetTime - now;
      throw new AppError(
        this.config.errorMessage,
        ErrorCodes.API_RATE_LIMIT_EXCEEDED,
        429,
        { timeToReset }
      );
    }

    entry.count++;
  }

  getTimeToReset(key: string): number {
    const entry = this.limits.get(key);
    if (!entry) return 0;
    return Math.max(0, entry.resetTime - Date.now());
  }

  reset(key: string): void {
    this.limits.delete(key);
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now >= entry.resetTime) {
        this.limits.delete(key);
      }
    }
  }
}