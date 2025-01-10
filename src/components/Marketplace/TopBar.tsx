import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Select } from '../UI/Select';
import type { MarketFilters } from './MarketplacePage';

const sortOptions = [
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'hashrate_desc', label: 'Hash Rate: Highest First' },
  { value: 'availability_desc', label: 'Availability: Most First' },
];

interface TopBarProps {
  filters: MarketFilters;
  onFilterChange: (filters: Partial<MarketFilters>) => void;
}

export function TopBar({ filters, onFilterChange }: TopBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-900/50 rounded-xl p-4">
      <div className="relative w-full sm:w-96">
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Search algorithms, sellers..."
          className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
      </div>
      
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <Select
          options={sortOptions}
          value={sortOptions.find(opt => opt.value === filters.sortBy)}
          onChange={(option) => onFilterChange({ sortBy: option.value })}
          className="w-full sm:w-48"
        />
        <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <SlidersHorizontal className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
}