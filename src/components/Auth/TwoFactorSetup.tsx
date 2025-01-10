import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Shield, Check, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { twoFactor } from '../../lib/api/twoFactor';

export function TwoFactorSetup() {
  const { user } = useAuth();
  const [secret, setSecret] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleEnable2FA = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    
    try {
      const { secret, qr_code } = await twoFactor.enable2FA(user.id);
      setSecret(secret);
      setQrCode(qr_code);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enable 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError('');

    try {
      await twoFactor.verify2FA(user.id, token);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-500/10 text-green-400 p-6 rounded-lg text-center">
        <Check className="w-12 h-12 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">2FA Successfully Enabled</h3>
        <p>Your account is now protected with two-factor authentication.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Enable Two-Factor Authentication</h2>
        <p className="text-gray-400">
          Protect your account with an additional layer of security using an authenticator app.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {!qrCode ? (
        <button
          onClick={handleEnable2FA}
          disabled={loading}
          className="w-full bg-primary text-background py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Setting up...' : 'Set up 2FA'}
        </button>
      ) : (
        <div className="space-y-6">
          <div className="bg-gray-900/50 p-6 rounded-lg text-center">
            <div className="bg-white p-4 rounded-lg inline-block mb-4">
              <QRCodeSVG value={qrCode} size={200} />
            </div>
            <p className="text-sm text-gray-400 mb-2">
              Scan this QR code with your authenticator app
            </p>
            <div className="font-mono text-sm bg-gray-800 p-2 rounded">
              {secret}
            </div>
          </div>

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
              {loading ? 'Verifying...' : 'Verify & Enable 2FA'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}