import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { marketplace } from '../../lib/api/marketplace';
import { useFormValidation } from '../../hooks/useFormValidation';
import { z } from 'zod';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { FormField } from '../UI/FormField';
import { ConfirmDialog } from '../UI/ConfirmDialog';

const listingSchema = z.object({
  algorithm: z.string().min(1, 'Algorithm is required'),
  hashPower: z.number().min(0.1, 'Hash power must be at least 0.1 TH/s'),
  pricePerTh: z.number().min(0.01, 'Price must be at least 0.01'),
  minPurchase: z.number().min(0.1, 'Minimum purchase must be at least 0.1 TH/s'),
  maxPurchase: z.number().min(0.1, 'Maximum purchase must be at least 0.1 TH/s'),
  availabilityDays: z.string().min(1, 'Availability period is required')
});

export function CreateListing({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    algorithm: 'SHA256',
    hashPower: '',
    pricePerTh: '',
    minPurchase: '',
    maxPurchase: '',
    availabilityDays: '7'
  });

  const { errors, validate, setErrors } = useFormValidation(listingSchema);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const numericData = {
      ...formData,
      hashPower: parseFloat(formData.hashPower),
      pricePerTh: parseFloat(formData.pricePerTh),
      minPurchase: parseFloat(formData.minPurchase),
      maxPurchase: parseFloat(formData.maxPurchase),
    };

    if (!validate(numericData)) {
      return;
    }

    setShowConfirm(true);
  };

  const confirmCreate = async () => {
    setShowConfirm(false);
    setLoading(true);

    try {
      const now = new Date();
      const endDate = new Date();
      endDate.setDate(now.getDate() + parseInt(formData.availabilityDays));

      await marketplace.createListing({
        seller_id: user!.id,
        algorithm: formData.algorithm,
        hash_power: parseFloat(formData.hashPower),
        price_per_th: parseFloat(formData.pricePerTh),
        min_purchase: parseFloat(formData.minPurchase),
        max_purchase: parseFloat(formData.maxPurchase),
        availability_window: `[${now.toISOString()},${endDate.toISOString()}]`,
        status: 'active'
      });

      onSuccess();
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Failed to create listing' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-gray-900/50 p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-6">Create New Listing</h2>

        {errors.submit && (
          <div className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-4">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Algorithm"
            required
            error={errors.algorithm}
          >
            <select
              value={formData.algorithm}
              onChange={(e) => setFormData({ ...formData, algorithm: e.target.value })}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="SHA256">SHA-256</option>
              <option value="ETHASH">Ethash</option>
              <option value="SCRYPT">Scrypt</option>
            </select>
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Hash Power (TH/s)"
              required
              error={errors.hashPower}
            >
              <input
                type="number"
                value={formData.hashPower}
                onChange={(e) => setFormData({ ...formData, hashPower: e.target.value })}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                min="0.1"
                step="0.1"
              />
            </FormField>

            <FormField
              label="Price per TH/s"
              required
              error={errors.pricePerTh}
            >
              <input
                type="number"
                value={formData.pricePerTh}
                onChange={(e) => setFormData({ ...formData, pricePerTh: e.target.value })}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                min="0.01"
                step="0.01"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Minimum Purchase (TH/s)"
              required
              error={errors.minPurchase}
            >
              <input
                type="number"
                value={formData.minPurchase}
                onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                min="0.1"
                step="0.1"
              />
            </FormField>

            <FormField
              label="Maximum Purchase (TH/s)"
              required
              error={errors.maxPurchase}
            >
              <input
                type="number"
                value={formData.maxPurchase}
                onChange={(e) => setFormData({ ...formData, maxPurchase: e.target.value })}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                min="0.1"
                step="0.1"
              />
            </FormField>
          </div>

          <FormField
            label="Availability Period (Days)"
            required
            error={errors.availabilityDays}
          >
            <select
              value={formData.availabilityDays}
              onChange={(e) => setFormData({ ...formData, availabilityDays: e.target.value })}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="7">7 Days</option>
              <option value="14">14 Days</option>
              <option value="30">30 Days</option>
              <option value="90">90 Days</option>
            </select>
          </FormField>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-primary text-background px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Creating...
                </>
              ) : (
                'Create Listing'
              )}
            </button>
          </div>
        </form>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Confirm Listing Creation"
        message={`Are you sure you want to create a listing for ${formData.hashPower} TH/s at $${formData.pricePerTh} per TH/s?`}
        confirmLabel="Create Listing"
        type="info"
        onConfirm={confirmCreate}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}