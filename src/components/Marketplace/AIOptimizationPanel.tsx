import React from 'react';
import { Brain, Zap, TrendingUp, Cpu } from 'lucide-react';

interface OptimizationMetric {
  label: string;
  value: string;
  change: number;
  icon: typeof Brain;
}

const metrics: OptimizationMetric[] = [
  {
    label: 'AI Efficiency Score',
    value: '94.2%',
    change: 2.3,
    icon: Brain
  },
  {
    label: 'Power Optimization',
    value: '87.5%',
    change: 1.8,
    icon: Zap
  },
  {
    label: 'Profit Prediction',
    value: '+12.4%',
    change: 3.2,
    icon: TrendingUp
  },
  {
    label: 'Hash Rate Utilization',
    value: '96.8%',
    change: 0.5,
    icon: Cpu
  }
];

export function AIOptimizationPanel() {
  return (
    <div className="bg-gray-900/50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-white">AI Optimization</h2>
        <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
          <Brain className="w-4 h-4" />
          <span>Active</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <metric.icon className="w-4 h-4 text-primary" />
              <span className="text-sm text-gray-400">{metric.label}</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-xl font-medium text-white">{metric.value}</span>
              <span className={`text-sm ${metric.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {metric.change > 0 ? '+' : ''}{metric.change}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Next Optimization in</span>
          <span className="text-sm text-primary">04:32</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1.5">
          <div className="bg-primary h-full rounded-full" style={{ width: '65%' }} />
        </div>
      </div>
    </div>
  );
}