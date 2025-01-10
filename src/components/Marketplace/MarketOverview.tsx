import React from 'react';
import { ArrowUpRight, ArrowDownRight, Cpu, Leaf, Users } from 'lucide-react';

interface MarketOverviewProps {
  className?: string;
}

export function MarketOverview({ className = '' }: MarketOverviewProps) {
  return (
    <aside className={`bg-gray-900/50 rounded-xl p-4 ${className}`}>
      <h2 className="font-medium text-white mb-4">Market Overview</h2>
      
      <div className="space-y-4">
        <div className="p-3 bg-gray-900 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">24h Volume</div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-white">1,234.56 BTC</span>
            <span className="flex items-center text-green-400 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              8.12%
            </span>
          </div>
        </div>

        <div className="p-3 bg-gray-900 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">Active Miners</div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-white">2,345</span>
            <span className="flex items-center text-green-400 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              12.3%
            </span>
          </div>
        </div>

        <div className="p-3 bg-gray-900 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">AI Optimization Savings</div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-white">15.4%</span>
            <span className="flex items-center text-green-400 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              2.1%
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <h3 className="font-medium text-white mb-3">Network Stats</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 hover:bg-gray-900 rounded">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" />
                <span className="text-gray-300">Total Hash Power</span>
              </div>
              <span className="text-white font-medium">12.5 EH/s</span>
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-gray-900 rounded">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-gray-300">DAO Members</span>
              </div>
              <span className="text-white font-medium">8,234</span>
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-gray-900 rounded">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-primary" />
                <span className="text-gray-300">Green Energy</span>
              </div>
              <span className="text-white font-medium">76%</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-white mb-3">Top Algorithms</h3>
          <div className="space-y-2">
            {['SHA-256', 'Ethash', 'Scrypt'].map((algo) => (
              <div key={algo} className="flex items-center justify-between p-2 hover:bg-gray-900 rounded">
                <span className="text-gray-300">{algo}</span>
                <span className="text-white font-medium">
                  {(Math.random() * 1000).toFixed(2)} TH/s
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}