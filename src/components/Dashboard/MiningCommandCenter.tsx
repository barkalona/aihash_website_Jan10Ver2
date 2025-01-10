import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Activity, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { DataVisualization } from './DataVisualization';

const mockWallets = [
  "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  "0x123d35Cc6634C0532925a3b844Bc454e4438f123",
  "0x456d35Cc6634C0532925a3b844Bc454e4438f456"
];

export function MiningCommandCenter() {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  // Redirect to auth if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    // Simulate wallet connection after 1 second
    const timer = setTimeout(() => {
      const randomWallet = mockWallets[Math.floor(Math.random() * mockWallets.length)];
      setWalletAddress(randomWallet);
      setIsConnected(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Connecting to Sui wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">AI Mining Command Center</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img src="https://cryptologos.cc/logos/sui-sui-logo.png" alt="Sui" className="w-5 h-5" />
              <span className="text-sm text-gray-400">{walletAddress}</span>
            </div>
            <div className="flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              Connected
            </div>
          </div>
        </div>

        <DataVisualization />

        {/* Mining Rigs List */}
        <div className="bg-gray-900/50 rounded-xl p-6">
          <h2 className="text-lg font-medium text-white mb-4">Mining Rigs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Rig {i + 1}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    i % 3 === 0 ? 'bg-yellow-500/10 text-yellow-400' :
                    i % 5 === 0 ? 'bg-red-500/10 text-red-400' :
                    'bg-green-500/10 text-green-400'
                  }`}>
                    {i % 3 === 0 ? 'Maintenance' : i % 5 === 0 ? 'Offline' : 'Active'}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Hashrate</span>
                    <span className="text-white">{(Math.random() * 100 + 50).toFixed(2)} TH/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Temperature</span>
                    <span className="text-white">{Math.floor(Math.random() * 20 + 60)}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Power</span>
                    <span className="text-white">{(Math.random() * 2 + 1).toFixed(2)} kW</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}