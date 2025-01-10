import React from 'react';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface RiskIndicatorProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export function RiskIndicator({ score, size = 'md', showDetails = false }: RiskIndicatorProps) {
  const getColor = (score: number) => {
    if (score >= 75) return 'text-red-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getIcon = (score: number) => {
    if (score >= 75) return AlertTriangle;
    if (score >= 50) return Shield;
    return CheckCircle;
  };

  const getMessage = (score: number) => {
    if (score >= 75) return 'High Risk';
    if (score >= 50) return 'Medium Risk';
    return 'Low Risk';
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const Icon = getIcon(score);
  const color = getColor(score);

  return (
    <div className={`flex items-center gap-2 ${sizeClasses[size]}`}>
      <Icon className={`w-5 h-5 ${color}`} />
      <div>
        <span className={color}>{getMessage(score)}</span>
        {showDetails && (
          <div className="text-sm text-gray-400">
            Risk Score: {score}/100
          </div>
        )}
      </div>
    </div>
  );
}