import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PurchaseModal } from '../PurchaseModal';
import { marketplace } from '../../../lib/api/marketplace';
import { useAuth } from '../../../contexts/AuthContext';

// Mock dependencies
vi.mock('../../../lib/api/marketplace', () => ({
  marketplace: {
    createOrder: vi.fn()
  }
}));

vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: vi.fn()
}));

describe('PurchaseModal', () => {
  const mockListing = {
    id: '1',
    algorithm: 'SHA-256',
    hash_power: 100,
    price_per_th: 2.5,
    min_purchase: 10,
    max_purchase: 1000
  };

  const mockUser = { id: 'test-user' };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({ user: mockUser } as any);
  });

  test('renders purchase form correctly', () => {
    render(
      <PurchaseModal
        listing={mockListing}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    expect(screen.getByText(/purchase hash power/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hash power/i)).toBeInTheDocument();
    expect(screen.getByText(/price per th\/s/i)).toBeInTheDocument();
  });

  test('validates minimum purchase amount', async () => {
    render(
      <PurchaseModal
        listing={mockListing}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    const input = screen.getByLabelText(/hash power/i);
    fireEvent.change(input, { target: { value: '5' } });
    fireEvent.click(screen.getByText(/purchase hash power/i));

    expect(await screen.findByText(/must be between/i)).toBeInTheDocument();
  });

  test('handles successful purchase', async () => {
    const onSuccess = vi.fn();
    vi.mocked(marketplace.createOrder).mockResolvedValue({ data: {}, error: null });

    render(
      <PurchaseModal
        listing={mockListing}
        onClose={vi.fn()}
        onSuccess={onSuccess}
      />
    );

    const input = screen.getByLabelText(/hash power/i);
    fireEvent.change(input, { target: { value: '50' } });
    fireEvent.click(screen.getByText(/purchase hash power/i));

    await waitFor(() => {
      expect(marketplace.createOrder).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  test('handles purchase error', async () => {
    vi.mocked(marketplace.createOrder).mockResolvedValue({ 
      data: null, 
      error: new Error('Failed to create order')
    });

    render(
      <PurchaseModal
        listing={mockListing}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    const input = screen.getByLabelText(/hash power/i);
    fireEvent.change(input, { target: { value: '50' } });
    fireEvent.click(screen.getByText(/purchase hash power/i));

    expect(await screen.findByText(/failed to create order/i)).toBeInTheDocument();
  });

  test('requires authentication', () => {
    vi.mocked(useAuth).mockReturnValue({ user: null } as any);

    render(
      <PurchaseModal
        listing={mockListing}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    expect(screen.getByText(/please sign in/i)).toBeInTheDocument();
  });
});