import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    loading: vi.fn(),
  },
  Toaster: vi.fn(),
}));

// Mock console.error for ErrorBoundary tests
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Error boundaries should implement getDerivedStateFromError')
  ) {
    return;
  }
  originalConsoleError.apply(console, args);
};