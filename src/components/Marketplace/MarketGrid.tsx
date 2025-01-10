import React, { useMemo } from 'react';
import { HashPowerCard } from './HashPowerCard';
import type { MarketFilters } from './MarketplacePage';

interface MarketGridProps {
  filters: MarketFilters;
  className?: string;
}

// Mock data for demonstration
const mockListings = [
  {
    id: 1,
    algorithm: 'sha256',
    name: 'SHA-256',
    description: 'Bitcoin Mining',
    available: true,
    hash_power: 125,
    price_per_th: 2.45,
    priceChange: 5.2,
    aiEfficiency: 94,
    greenScore: 87,
    verified: true,
    min_purchase: 10,
    max_purchase: 1000
  },
  {
    id: 2,
    algorithm: 'ethash',
    name: 'Ethash',
    description: 'Ethereum Mining',
    available: true,
    hash_power: 85,
    price_per_th: 3.75,
    priceChange: -2.1,
    aiEfficiency: 91,
    greenScore: 82,
    verified: true,
    min_purchase: 5,
    max_purchase: 500
  },
  {
    id: 3,
    algorithm: 'scrypt',
    name: 'Scrypt',
    description: 'Litecoin Mining',
    available: false,
    hash_power: 200,
    price_per_th: 1.95,
    priceChange: 3.8,
    aiEfficiency: 89,
    greenScore: 85,
    verified: true,
    min_purchase: 20,
    max_purchase: 2000
  }
];

export function MarketGrid({ filters, className = '' }: MarketGridProps) {
  const filteredListings = useMemo(() => {
    return mockListings.filter(listing => {
      // Algorithm filter
      if (filters.algorithms.length > 0 && !filters.algorithms.includes(listing.algorithm)) {
        return false;
      }

      // Price range filter
      if (filters.priceRange.length > 0) {
        const matchesPrice = filters.priceRange.some(range => {
          switch (range) {
            case 'under1':
              return listing.price_per_th < 1;
            case '1to5':
              return listing.price_per_th >= 1 && listing.price_per_th <= 5;
            case 'over5':
              return listing.price_per_th > 5;
            default:
              return true;
          }
        });
        if (!matchesPrice) return false;
      }

      // Availability filter
      if (filters.availability.length > 0) {
        const matchesAvailability = filters.availability.some(avail => {
          return (avail === 'instant' && listing.available) || 
                 (avail === 'scheduled' && !listing.available);
        });
        if (!matchesAvailability) return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return listing.name.toLowerCase().includes(searchLower) ||
               listing.description.toLowerCase().includes(searchLower);
      }

      return true;
    });
  }, [filters]);

  const sortedListings = useMemo(() => {
    return [...filteredListings].sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_asc':
          return a.price_per_th - b.price_per_th;
        case 'price_desc':
          return b.price_per_th - a.price_per_th;
        case 'hashrate_desc':
          return b.hash_power - a.hash_power;
        case 'availability_desc':
          return Number(b.available) - Number(a.available);
        default:
          return 0;
      }
    });
  }, [filteredListings, filters.sortBy]);

  if (sortedListings.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-400">No hash power listings match your filters.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 text-primary hover:text-primary/80"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedListings.map((listing) => (
          <HashPowerCard 
            key={listing.id}
            listing={listing}
          />
        ))}
      </div>
    </div>
  );
}