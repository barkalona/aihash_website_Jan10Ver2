import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Filter {
  id: string;
  label: string;
  count: number;
}

interface FilterSectionProps {
  title: string;
  filters: Filter[];
  selected: string[];
  onToggle: (id: string) => void;
}

export function FilterSection({ title, filters, selected, onToggle }: FilterSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border-b border-gray-800 last:border-0 py-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left mb-2"
      >
        <h3 className="font-medium text-white">{title}</h3>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>
      
      {isExpanded && (
        <div className="space-y-2">
          {filters.map((filter) => (
            <label
              key={filter.id}
              className="flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selected.includes(filter.id)}
                  onChange={() => onToggle(filter.id)}
                  className="rounded border-gray-600 text-primary focus:ring-primary bg-gray-800"
                />
                <span className="ml-2 text-sm text-gray-300 group-hover:text-white">
                  {filter.label}
                </span>
              </div>
              <span className="text-sm text-gray-500">{filter.count}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}