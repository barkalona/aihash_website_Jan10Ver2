import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { twoFactor } from '../../lib/api/twoFactor';

interface TwoFactorVerifyProps {
  onSuccess: () => void;
}

export function TwoFactorVerify({ onSuccess }: TwoFactorVerifyProps) {
  const { user } = useAuth();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError('');

    try {
      await twoFactor.validate2FA(user.id, token);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Two-Factor Verification</h2>
        <p className="text-gray-400">
          Enter the verification code from your authenticator app
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Verification Code
          </label>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter 6-digit code"
            className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
            required
            pattern="[0-9]{6}"
            maxLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading || token.length !== 6}
          className="w-full bg-primary text-background py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>
    </div>
  );
}