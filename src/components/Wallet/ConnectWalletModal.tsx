import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Wallet, AlertCircle } from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConnectWalletModal({ isOpen, onClose }: ConnectWalletModalProps) {
  const navigate = useNavigate();
  const { isConnecting, connect } = useWallet();
  const { user } = useAuth();

  if (!isOpen) return null;

  const handleConnect = async () => {
    if (!user) {
      navigate('/auth');
      onClose();
      return;
    }

    try {
      await connect();
      toast.success('Wallet connected successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to connect wallet');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Connect Wallet</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!user && (
          <div className="bg-yellow-500/10 text-yellow-400 p-4 rounded-lg mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">
              You need to sign in before connecting your wallet. Click the button below to proceed with authentication.
            </p>
          </div>
        )}

        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full flex items-center justify-center gap-2 bg-primary text-background py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Wallet className="w-5 h-5" />
          {isConnecting ? 'Connecting...' : user ? 'Connect Wallet' : 'Sign In to Continue'}
        </button>

        <p className="text-sm text-gray-400 mt-4 text-center">
          By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}