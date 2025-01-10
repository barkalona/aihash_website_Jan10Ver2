import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { profiles } from '../../lib/api/profiles';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { TwoFactorSetup } from '../Auth/TwoFactorSetup';
import { ProfileForm } from './ProfileForm';
import { WalletManager } from './WalletManager';
import { NotificationPreferences } from './NotificationPreferences';
import { Shield, User, Wallet, Bell } from 'lucide-react';

export function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: apiError } = await profiles.getUserProfile(user!.id);
      if (apiError) throw apiError;
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-500/10 text-red-400 p-6 rounded-lg text-center">
          <p className="mb-4">{error}</p>
          <button
            onClick={loadProfile}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <h1 className="text-2xl font-bold mb-8">Profile Settings</h1>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 space-y-2">
            <button
              onClick={() => setActiveTab('general')}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'general'
                  ? 'bg-primary text-background'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <User className="w-5 h-5" />
              General
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'security'
                  ? 'bg-primary text-background'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Shield className="w-5 h-5" />
              Security
            </button>
            <button
              onClick={() => setActiveTab('wallets')}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'wallets'
                  ? 'bg-primary text-background'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Wallet className="w-5 h-5" />
              Wallets
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'notifications'
                  ? 'bg-primary text-background'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Bell className="w-5 h-5" />
              Notifications
            </button>
          </div>

          <div className="flex-grow">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="bg-gray-900/50 rounded-xl p-6">
                  <h2 className="text-lg font-medium mb-4">Profile Information</h2>
                  <ProfileForm profile={profile} onUpdate={loadProfile} />
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-gray-900/50 rounded-xl p-6">
                  <h2 className="text-lg font-medium mb-4">Two-Factor Authentication</h2>
                  <TwoFactorSetup />
                </div>
              </div>
            )}

            {activeTab === 'wallets' && (
              <div className="space-y-6">
                <div className="bg-gray-900/50 rounded-xl p-6">
                  <h2 className="text-lg font-medium mb-4">Connected Wallets</h2>
                  <WalletManager 
                    wallets={profile?.wallet_addresses || []}
                    onUpdate={loadProfile}
                  />
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="bg-gray-900/50 rounded-xl p-6">
                  <h2 className="text-lg font-medium mb-4">Notification Settings</h2>
                  <NotificationPreferences 
                    profile={profile}
                    onUpdate={loadProfile}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}