import { rateLimiters } from '../rateLimit';
import { errorHandler } from '../errors';

export const apiMiddleware = {
  async rateLimit(endpoint: string, userId: string) {
    const key = `${endpoint}:${userId}`;
    try {
      await rateLimiters.api.checkLimit(key);
    } catch (error) {
      throw errorHandler.handle(error);
    }
  },

  async authRateLimit(userId: string) {
    const key = `auth:${userId}`;
    try {
      await rateLimiters.auth.checkLimit(key);
    } catch (error) {
      throw errorHandler.handle(error);
    }
  }
};