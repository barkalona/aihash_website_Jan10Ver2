import React from 'react';

export function PriceChart() {
  return (
    <div className="w-full h-full flex items-end">
      {/* Simplified price chart visualization */}
      {Array.from({ length: 24 }).map((_, i) => {
        const height = 30 + Math.random() * 50;
        return (
          <div
            key={i}
            className="flex-1 bg-primary/20 mx-px rounded-t"
            style={{ height: `${height}%` }}
          />
        );
      })}
    </div>
  );
}