import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { marketplace } from '../../lib/api/marketplace';
import { useSimulation } from '../../hooks/useSimulation';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { FormField } from '../UI/FormField';
import { ConfirmDialog } from '../UI/ConfirmDialog';

interface HashPowerListing {
  id: string;
  algorithm: string;
  hash_power: number;
  price_per_th: number;
  min_purchase: number;
  max_purchase: number;
}

interface PurchaseModalProps {
  listing: HashPowerListing;
  onClose: () => void;
  onSuccess: () => void;
}

export function PurchaseModal({ listing, onClose, onSuccess }: PurchaseModalProps) {
  const { user } = useAuth();
  const [hashPower, setHashPower] = useState(listing.min_purchase.toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const { results: simulation } = useSimulation({
    algorithm: listing.algorithm,
    hashPower: parseFloat(hashPower) || 0,
    powerCosts: {
      kwhPrice: 0.12,
      efficiency: 0.85,
      maintenanceCost: 5
    },
    duration: 86400
  });

  const totalPrice = (parseFloat(hashPower) || 0) * listing.price_per_th;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Please sign in to make a purchase');
      return;
    }

    const hashPowerNum = parseFloat(hashPower);
    if (isNaN(hashPowerNum)) {
      setError('Please enter a valid hash power amount');
      return;
    }

    if (hashPowerNum < listing.min_purchase || hashPowerNum > listing.max_purchase) {
      setError(`Purchase amount must be between ${listing.min_purchase} and ${listing.max_purchase} TH/s`);
      return;
    }

    setShowConfirm(true);
  };

  const confirmPurchase = async () => {
    setShowConfirm(false);
    setLoading(true);
    setError('');

    try {
      await marketplace.createOrder({
        buyer_id: user!.id,
        listing_id: listing.id,
        hash_power: parseFloat(hashPower),
        price_per_th: listing.price_per_th,
        total_price: totalPrice,
        status: 'pending',
        payment_status: 'pending',
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 86400000).toISOString()
      });

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
        <div className="bg-gray-900 rounded-xl max-w-md w-full p-6 m-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Purchase Hash Power</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Hash Power (TH/s)"
              required
              helpText={`Min: ${listing.min_purchase} TH/s, Max: ${listing.max_purchase} TH/s`}
              error={error && error.includes('amount') ? error : undefined}
            >
              <input
                type="number"
                value={hashPower}
                onChange={(e) => setHashPower(e.target.value)}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                required
                min={listing.min_purchase}
                max={listing.max_purchase}
                step="0.1"
              />
            </FormField>

            <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Price per TH/s</span>
                <span className="text-white">${listing.price_per_th}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Hash Power</span>
                <span className="text-white">{hashPower} TH/s</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-gray-400">Total Price</span>
                <span className="text-white">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {simulation && (
              <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                <h3 className="font-medium mb-2">24h Projection</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Revenue</span>
                  <span className="text-green-400">${simulation.dailyRevenue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Costs</span>
                  <span className="text-red-400">${simulation.dailyCosts.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-gray-400">Profit</span>
                  <span className="text-white">${simulation.dailyProfit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">ROI</span>
                  <span className="text-white">{simulation.roi.toFixed(2)}%</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary text-background py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Processing...
                </>
              ) : (
                'Purchase Hash Power'
              )}
            </button>
          </form>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Confirm Purchase"
        message={`Are you sure you want to purchase ${hashPower} TH/s for $${totalPrice.toFixed(2)}?`}
        confirmLabel="Confirm Purchase"
        type="warning"
        onConfirm={confirmPurchase}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}