import React, { useState } from 'react';
import { useFormValidation } from '../../hooks/useFormValidation';
import { profiles } from '../../lib/api/profiles';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { z } from 'zod';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  avatarUrl: z.string().url().optional().or(z.literal('')),
});

export function ProfileForm({ profile, onUpdate }: { profile: any; onUpdate: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    displayName: profile?.display_name || '',
    email: profile?.email || '',
    avatarUrl: profile?.avatar_url || '',
  });

  const { errors, validate, setErrors } = useFormValidation(profileSchema);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(formData)) return;

    setLoading(true);
    try {
      await profiles.updateUserProfile(profile.id, {
        full_name: formData.fullName,
        display_name: formData.displayName,
        email: formData.email,
        avatar_url: formData.avatarUrl || null,
      });
      onUpdate();
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.submit && (
        <div className="bg-red-500/10 text-red-400 p-3 rounded-lg">
          {errors.submit}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Full Name
        </label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
        />
        {errors.fullName && (
          <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Display Name
        </label>
        <input
          type="text"
          value={formData.displayName}
          onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
          className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
        />
        {errors.displayName && (
          <p className="text-red-400 text-sm mt-1">{errors.displayName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
        />
        {errors.email && (
          <p className="text-red-400 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Avatar URL
        </label>
        <input
          type="url"
          value={formData.avatarUrl}
          onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
          className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
          placeholder="https://example.com/avatar.jpg"
        />
        {errors.avatarUrl && (
          <p className="text-red-400 text-sm mt-1">{errors.avatarUrl}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full bg-primary text-background py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {loading ? (
          <>
            <LoadingSpinner size="sm" />
            Saving...
          </>
        ) : (
          'Save Changes'
        )}
      </button>
    </form>
  );
}