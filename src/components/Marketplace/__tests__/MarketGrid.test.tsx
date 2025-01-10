import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MarketGrid } from '../MarketGrid';
import { marketplace } from '../../../lib/api/marketplace';

// Mock marketplace API
vi.mock('../../../lib/api/marketplace', () => ({
  marketplace: {
    getListings: vi.fn()
  }
}));

describe('MarketGrid', () => {
  const mockListings = [
    {
      id: '1',
      algorithm: 'SHA-256',
      hash_power: 100,
      price_per_th: 2.5,
      min_purchase: 10,
      max_purchase: 1000,
      status: 'active',
      seller_profiles: {
        business_name: 'Test Seller'
      }
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(marketplace.getListings).mockResolvedValue({ data: mockListings, error: null });
  });

  test('renders listings correctly', () => {
    render(<MarketGrid filters={{
      algorithms: [],
      priceRange: [],
      availability: [],
      search: '',
      sortBy: 'price_asc'
    }} />);

    expect(screen.getByText('SHA-256')).toBeInTheDocument();
    expect(screen.getByText('Test Seller')).toBeInTheDocument();
    expect(screen.getByText('100 TH/s')).toBeInTheDocument();
  });

  test('applies filters correctly', () => {
    render(<MarketGrid filters={{
      algorithms: ['SHA-256'],
      priceRange: ['1to5'],
      availability: ['instant'],
      search: 'Test',
      sortBy: 'price_asc'
    }} />);

    expect(marketplace.getListings).toHaveBeenCalledWith(
      expect.objectContaining({ algorithm: 'SHA-256' })
    );
  });

  test('handles empty listings state', async () => {
    vi.mocked(marketplace.getListings).mockResolvedValue({ data: [], error: null });

    render(<MarketGrid filters={{
      algorithms: [],
      priceRange: [],
      availability: [],
      search: '',
      sortBy: 'price_asc'
    }} />);

    expect(await screen.findByText(/no hash power listings/i)).toBeInTheDocument();
  });

  test('handles error state', async () => {
    vi.mocked(marketplace.getListings).mockResolvedValue({ 
      data: null, 
      error: new Error('Failed to load listings')
    });

    render(<MarketGrid filters={{
      algorithms: [],
      priceRange: [],
      availability: [],
      search: '',
      sortBy: 'price_asc'
    }} />);

    expect(await screen.findByText(/failed to load listings/i)).toBeInTheDocument();
  });
});