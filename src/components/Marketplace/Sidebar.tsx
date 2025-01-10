import React from 'react';
import { FilterSection } from './FilterSection';
import type { MarketFilters } from './MarketplacePage';

interface SidebarProps {
  className?: string;
  filters: MarketFilters;
  onFilterChange: (filters: Partial<MarketFilters>) => void;
}

export function Sidebar({ className = '', filters, onFilterChange }: SidebarProps) {
  const handleFilterToggle = (category: keyof MarketFilters, value: string) => {
    const currentValues = filters[category] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFilterChange({ [category]: newValues });
  };

  return (
    <aside className={`bg-gray-900/50 rounded-xl p-4 ${className}`}>
      <FilterSection
        title="Algorithm"
        filters={[
          { id: 'sha256', label: 'SHA-256', count: 156 },
          { id: 'ethash', label: 'Ethash', count: 89 },
          { id: 'scrypt', label: 'Scrypt', count: 45 },
        ]}
        selected={filters.algorithms}
        onToggle={(value) => handleFilterToggle('algorithms', value)}
      />
      
      <FilterSection
        title="Price Range"
        filters={[
          { id: 'under1', label: 'Under $1/TH', count: 78 },
          { id: '1to5', label: '$1 - $5/TH', count: 124 },
          { id: 'over5', label: 'Over $5/TH', count: 88 },
        ]}
        selected={filters.priceRange}
        onToggle={(value) => handleFilterToggle('priceRange', value)}
      />
      
      <FilterSection
        title="Availability"
        filters={[
          { id: 'instant', label: 'Instant', count: 145 },
          { id: 'scheduled', label: 'Scheduled', count: 67 },
        ]}
        selected={filters.availability}
        onToggle={(value) => handleFilterToggle('availability', value)}
      />
    </aside>
  );
}