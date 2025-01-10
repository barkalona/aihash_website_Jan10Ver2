import { describe, test, expect, vi } from 'vitest';
import { AppError, errorHandler } from '../errors';
import { ErrorCodes } from '../errors/codes';
import { ErrorMessages } from '../errors/messages';

vi.mock('react-hot-toast', () => ({
  toast: {
    error: vi.fn()
  }
}));

describe('AppError', () => {
  test('creates error with correct properties', () => {
    const error = new AppError('Test error', ErrorCodes.API_SERVER_ERROR, 500);
    
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Test error');
    expect(error.code).toBe(ErrorCodes.API_SERVER_ERROR);
    expect(error.statusCode).toBe(500);
  });

  test('creates error with default status code', () => {
    const error = new AppError('Test error', ErrorCodes.API_SERVER_ERROR);
    expect(error.statusCode).toBe(500);
  });
});

describe('errorHandler', () => {
  test('handles AppError correctly', () => {
    const error = new AppError('Test error', ErrorCodes.API_SERVER_ERROR);
    const result = errorHandler.handle(error);
    
    expect(result).toBe(error);
  });

  test('handles standard Error correctly', () => {
    const error = new Error('Standard error');
    const result = errorHandler.handle(error);
    
    expect(result).toBeInstanceOf(AppError);
    expect(result.code).toBe('UNKNOWN_ERROR');
  });

  test('handles unknown error types', () => {
    const result = errorHandler.handle('string error');
    
    expect(result).toBeInstanceOf(AppError);
    expect(result.code).toBe('UNKNOWN_ERROR');
  });
});

describe('Error Messages', () => {
  test('has matching messages for all error codes', () => {
    const errorCodeKeys = Object.keys(ErrorCodes);
    const messageKeys = Object.keys(ErrorMessages);
    
    expect(errorCodeKeys.length).toBe(messageKeys.length);
    errorCodeKeys.forEach(code => {
      expect(ErrorMessages[code as keyof typeof ErrorCodes]).toBeDefined();
    });
  });
});