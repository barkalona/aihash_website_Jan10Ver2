import { toast } from 'react-hot-toast';

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = {
  handle: (error: unknown) => {
    if (error instanceof AppError) {
      toast.error(error.message);
      return error;
    }

    if (error instanceof Error) {
      toast.error('An unexpected error occurred. Please try again.');
      console.error('Unhandled error:', error);
      return new AppError(error.message, 'UNKNOWN_ERROR');
    }

    console.error('Unknown error type:', error);
    return new AppError('An unexpected error occurred', 'UNKNOWN_ERROR');
  },

  api: {
    handle: (error: unknown) => {
      if (error instanceof AppError) {
        return {
          error: {
            message: error.message,
            code: error.code,
            statusCode: error.statusCode
          }
        };
      }

      console.error('API Error:', error);
      return {
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_SERVER_ERROR',
          statusCode: 500
        }
      };
    }
  }
};