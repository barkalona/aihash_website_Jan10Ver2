import React, { useState } from 'react';
import { useFormValidation } from '../../hooks/useFormValidation';
import { profiles } from '../../lib/api/profiles';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { Wallet, Plus, Check, X } from 'lucide-react';
import { z } from 'zod';

const walletSchema = z.object({
  address: z.string().min(42, 'Invalid wallet address'),
  blockchain: z.string().min(1, 'Blockchain is required'),
});

export function WalletManager({ wallets, onUpdate }: { wallets: any[]; onUpdate: () => void }) {
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    blockchain: 'sui',
  });

  const { errors, validate, setErrors } = useFormValidation(walletSchema);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(formData)) return;

    setLoading(true);
    try {
      await profiles.verifyWalletAddress(
        'user_id', // Replace with actual user ID
        formData.address,
        formData.blockchain
      );
      setShowAddWallet(false);
      onUpdate();
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Failed to add wallet' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {wallets?.length > 0 ? (
        <div className="space-y-4">
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-white font-medium">{wallet.blockchain}</p>
                  <p className="text-sm text-gray-400">{wallet.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {wallet.is_verified ? (
                  <span className="flex items-center gap-1 text-green-400 text-sm">
                    <Check className="w-4 h-4" />
                    Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-yellow-400 text-sm">
                    Pending
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          No wallets connected yet
        </div>
      )}

      {showAddWallet ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.submit && (
            <div className="bg-red-500/10 text-red-400 p-3 rounded-lg">
              {errors.submit}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Blockchain
            </label>
            <select
              value={formData.blockchain}
              onChange={(e) => setFormData({ ...formData, blockchain: e.target.value })}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="sui">Sui</option>
              <option value="ethereum">Ethereum</option>
              <option value="solana">Solana</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Wallet Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Enter wallet address"
            />
            {errors.address && (
              <p className="text-red-400 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setShowAddWallet(false)}
              disabled={loading}
              className="flex-1 px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-background py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Adding...
                </>
              ) : (
                'Add Wallet'
              )}
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowAddWallet(true)}
          className="flex items-center gap-2 w-full justify-center bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Wallet
        </button>
      )}
    </div>
  );
}