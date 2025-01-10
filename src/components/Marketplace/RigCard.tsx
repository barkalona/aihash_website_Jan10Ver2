import React from 'react';
import { Cpu, Battery, Zap, MapPin, Star, Package, Snowflake, Shield } from 'lucide-react';
import type { MiningRig } from '../../lib/data/miningRigs';

interface RigCardProps {
  rig: MiningRig;
  onPurchase: (rig: MiningRig) => void;
}

export function RigCard({ rig, onPurchase }: RigCardProps) {
  return (
    <div className="bg-gray-900/50 rounded-xl p-6 hover:bg-gray-900/70 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-white">{rig.name}</h3>
          <p className="text-gray-400">{rig.model}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm ${
          rig.condition === 'New' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
        }`}>
          {rig.condition}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-primary" />
          <div>
            <p className="text-sm text-gray-400">Hashrate</p>
            <p className="font-medium">{rig.hashrate} {rig.hashrateUnit}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <div>
            <p className="text-sm text-gray-400">Power</p>
            <p className="font-medium">{rig.powerConsumption}W</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Battery className="w-4 h-4 text-primary" />
          <div>
            <p className="text-sm text-gray-400">Daily Profit</p>
            <p className="font-medium">${rig.dailyProfitability.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <div>
            <p className="text-sm text-gray-400">Location</p>
            <p className="font-medium">{rig.location}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Algorithms</span>
          <span className="text-white">{rig.algorithms.join(', ')}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Cooling</span>
          <span className="text-white">{rig.cooling}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Warranty</span>
          <span className="text-white">{rig.warranty.duration} months</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm">{rig.sellerRating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Package className="w-4 h-4 text-primary" />
            <span className="text-sm">{rig.quantity} available</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">${rig.price.toLocaleString()}</span>
          <button
            onClick={() => onPurchase(rig)}
            className="bg-primary text-background px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}