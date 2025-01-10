import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorFallback } from '../ErrorFallback';

describe('ErrorFallback', () => {
  const mockResetErrorBoundary = vi.fn();
  const mockError = new Error('Test error message');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders error message', () => {
    render(
      <ErrorFallback
        error={mockError}
        resetErrorBoundary={mockResetErrorBoundary}
      />
    );
    
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  test('calls resetErrorBoundary when try again button clicked', () => {
    render(
      <ErrorFallback
        error={mockError}
        resetErrorBoundary={mockResetErrorBoundary}
      />
    );
    
    fireEvent.click(screen.getByText('Try Again'));
    expect(mockResetErrorBoundary).toHaveBeenCalledTimes(1);
  });

  test('renders refresh page button', () => {
    const { getByText } = render(
      <ErrorFallback
        error={mockError}
        resetErrorBoundary={mockResetErrorBoundary}
      />
    );
    
    expect(getByText('Refresh Page')).toBeInTheDocument();
  });
});