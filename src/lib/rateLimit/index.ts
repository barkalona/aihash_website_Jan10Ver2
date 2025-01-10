import { RateLimiter } from './RateLimiter';

// Create rate limiters for different actions
export const rateLimiters = {
  api: new RateLimiter({
    windowMs: 60000, // 1 minute
    maxRequests: 100, // 100 requests per minute
    errorMessage: 'Too many API requests. Please try again in a moment.'
  }),

  auth: new RateLimiter({
    windowMs: 300000, // 5 minutes
    maxRequests: 5, // 5 attempts per 5 minutes
    errorMessage: 'Too many authentication attempts. Please try again later.'
  }),

  websocket: new RateLimiter({
    windowMs: 1000, // 1 second
    maxRequests: 10, // 10 messages per second
    errorMessage: 'Message rate limit exceeded. Please slow down.'
  }),

  marketplace: new RateLimiter({
    windowMs: 60000, // 1 minute
    maxRequests: 30, // 30 requests per minute
    errorMessage: 'Too many marketplace actions. Please try again shortly.'
  })
};