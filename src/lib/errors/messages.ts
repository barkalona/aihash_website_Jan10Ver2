import { ErrorCodes } from './codes';

export const ErrorMessages: Record<keyof typeof ErrorCodes, string> = {
  // Authentication Errors
  AUTH_INVALID_CREDENTIALS: 'Invalid email or password',
  AUTH_USER_NOT_FOUND: 'User not found',
  AUTH_EMAIL_IN_USE: 'Email is already in use',
  AUTH_WEAK_PASSWORD: 'Password is too weak',
  AUTH_INVALID_TOKEN: 'Invalid or expired token',
  
  // Marketplace Errors
  MARKETPLACE_INVALID_LISTING: 'Invalid marketplace listing',
  MARKETPLACE_INSUFFICIENT_FUNDS: 'Insufficient funds for this transaction',
  MARKETPLACE_LISTING_NOT_FOUND: 'Listing not found',
  MARKETPLACE_ORDER_FAILED: 'Failed to process order',
  
  // Wallet Errors
  WALLET_CONNECTION_FAILED: 'Failed to connect wallet',
  WALLET_TRANSACTION_FAILED: 'Transaction failed',
  WALLET_INSUFFICIENT_BALANCE: 'Insufficient wallet balance',
  
  // API Errors
  API_RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later',
  API_INVALID_REQUEST: 'Invalid request',
  API_SERVER_ERROR: 'Server error occurred',
  
  // Data Errors
  DATA_VALIDATION_FAILED: 'Data validation failed',
  DATA_NOT_FOUND: 'Data not found',
  DATA_CONFLICT: 'Data conflict occurred',
  
  // Network Errors
  NETWORK_OFFLINE: 'No internet connection',
  NETWORK_TIMEOUT: 'Request timed out',
  NETWORK_REQUEST_FAILED: 'Network request failed'
};