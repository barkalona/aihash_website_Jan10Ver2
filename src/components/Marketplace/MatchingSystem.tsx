import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { orderMatching } from '../../lib/api/orderMatching';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { Search, Clock, Check, AlertTriangle } from 'lucide-react';

interface MatchingRequest {
  algorithm: string;
  minHashPower: number;
  maxHashPower: number;
  maxPricePerTH: number;
  availability: {
    startTime: string;
    endTime: string;
  };
}

export function MatchingSystem() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);
  const [request, setRequest] = useState<MatchingRequest>({
    algorithm: 'SHA256',
    minHashPower: 100,
    maxHashPower: 1000,
    maxPricePerTH: 5,
    availability: {
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 86400000).toISOString()
    }
  });

  const handleSearch = async () => {
    try {
      setLoading(true);
      const results = await orderMatching.findMatches(request);
      setMatches(results);
    } catch (error) {
      console.error('Error finding matches:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/50 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6">Find Mining Rigs</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Algorithm
            </label>
            <select
              value={request.algorithm}
              onChange={(e) => setRequest({ ...request, algorithm: e.target.value })}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="SHA256">SHA-256</option>
              <option value="ETHASH">Ethash</option>
              <option value="SCRYPT">Scrypt</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Maximum Price per TH/s
            </label>
            <input
              type="number"
              value={request.maxPricePerTH}
              onChange={(e) => setRequest({ ...request, maxPricePerTH: parseFloat(e.target.value) })}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
              min="0"
              step="0.1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Minimum Hash Power (TH/s)
            </label>
            <input
              type="number"
              value={request.minHashPower}
              onChange={(e) => setRequest({ ...request, minHashPower: parseFloat(e.target.value) })}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Maximum Hash Power (TH/s)
            </label>
            <input
              type="number"
              value={request.maxHashPower}
              onChange={(e) => setRequest({ ...request, maxHashPower: parseFloat(e.target.value) })}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
              min="0"
            />
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-primary text-background py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" />
              Finding Matches...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Find Matches
            </>
          )}
        </button>
      </div>

      {matches.length > 0 ? (
        <div className="space-y-4">
          {matches.map((match) => (
            <div key={match.id} className="bg-gray-900/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium">{match.seller_profiles.business_name}</h3>
                  <p className="text-gray-400">{match.algorithm} Mining</p>
                </div>
                <div className="flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1 rounded-full">
                  <Check className="w-4 h-4" />
                  Available Now
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-400">Hash Power</p>
                  <p className="text-lg font-medium">{match.hash_power} TH/s</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Price per TH/s</p>
                  <p className="text-lg font-medium">${match.price_per_th}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Seller Rating</p>
                  <p className="text-lg font-medium">{match.seller_profiles.rating}/5</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Sales</p>
                  <p className="text-lg font-medium">{match.seller_profiles.total_sales}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Available immediately</span>
                </div>
                <button className="bg-primary text-background px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Purchase Now
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : !loading && (
        <div className="bg-gray-900/50 rounded-xl p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">No matching mining rigs found. Try adjusting your criteria.</p>
        </div>
      )}
    </div>
  );
}