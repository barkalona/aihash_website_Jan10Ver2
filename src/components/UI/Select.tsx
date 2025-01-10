import React from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  value?: Option;
  onChange?: (option: Option) => void;
  className?: string;
}

export function Select({ options, value, onChange, className = '' }: SelectProps) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value?.value}
        onChange={(e) => {
          const option = options.find(opt => opt.value === e.target.value);
          if (option && onChange) {
            onChange(option);
          }
        }}
        className="w-full appearance-none bg-gray-800 text-white rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-primary focus:outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
    </div>
  );
}