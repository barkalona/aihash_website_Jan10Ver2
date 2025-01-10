import { describe, test, expect, beforeEach, vi } from 'vitest';
import { RateLimiter } from '../rateLimit/RateLimiter';
import { AppError } from '../errors';
import { ErrorCodes } from '../errors/codes';

describe('RateLimiter', () => {
  let rateLimiter: RateLimiter;
  const testKey = 'test-key';

  beforeEach(() => {
    vi.useFakeTimers();
    rateLimiter = new RateLimiter({
      windowMs: 1000,
      maxRequests: 2
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('allows requests within limit', async () => {
    await expect(rateLimiter.checkLimit(testKey)).resolves.toBeUndefined();
    await expect(rateLimiter.checkLimit(testKey)).resolves.toBeUndefined();
  });

  test('blocks requests over limit', async () => {
    await rateLimiter.checkLimit(testKey);
    await rateLimiter.checkLimit(testKey);
    
    await expect(rateLimiter.checkLimit(testKey)).rejects.toThrow(AppError);
    await expect(rateLimiter.checkLimit(testKey)).rejects.toThrow(ErrorCodes.API_RATE_LIMIT_EXCEEDED);
  });

  test('resets after window expires', async () => {
    await rateLimiter.checkLimit(testKey);
    await rateLimiter.checkLimit(testKey);
    
    vi.advanceTimersByTime(1001);
    
    await expect(rateLimiter.checkLimit(testKey)).resolves.toBeUndefined();
  });

  test('returns correct time to reset', async () => {
    await rateLimiter.checkLimit(testKey);
    
    const timeToReset = rateLimiter.getTimeToReset(testKey);
    expect(timeToReset).toBeGreaterThan(0);
    expect(timeToReset).toBeLessThanOrEqual(1000);
  });

  test('cleanup removes expired entries', async () => {
    await rateLimiter.checkLimit(testKey);
    
    vi.advanceTimersByTime(1001);
    rateLimiter.cleanup();
    
    expect(rateLimiter.getTimeToReset(testKey)).toBe(0);
  });
});