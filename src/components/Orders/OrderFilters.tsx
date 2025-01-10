import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Select } from '../UI/Select';

const sortOptions = [
  { value: 'date_desc', label: 'Newest First' },
  { value: 'date_asc', label: 'Oldest First' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'hash_power_desc', label: 'Hash Power: High to Low' },
];

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'expired', label: 'Expired' },
];

interface OrderFilters {
  search: string;
  status: string;
  sortBy: string;
}

interface OrderFiltersProps {
  filters: OrderFilters;
  onFilterChange: (filters: Partial<OrderFilters>) => void;
}

export function OrderFilters({ filters, onFilterChange }: OrderFiltersProps) {
  return (
    <div className="bg-gray-900/50 rounded-xl p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search orders..."
            className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
        
        <div className="flex gap-4">
          <Select
            options={statusOptions}
            value={statusOptions.find(opt => opt.value === filters.status)}
            onChange={(option) => onFilterChange({ status: option.value })}
            className="w-40"
          />
          
          <Select
            options={sortOptions}
            value={sortOptions.find(opt => opt.value === filters.sortBy)}
            onChange={(option) => onFilterChange({ sortBy: option.value })}
            className="w-48"
          />
        </div>
      </div>
    </div>
  );
}