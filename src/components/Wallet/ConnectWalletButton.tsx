import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

export function ConnectWalletButton() {
  const navigate = useNavigate();
  const { isConnecting, isConnected, walletAddress, connect, disconnect } = useWallet();
  const { user } = useAuth();

  const handleConnect = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      await connect();
      toast.success('Wallet connected successfully');
      navigate('/dashboard'); // Redirect to dashboard after connection
    } catch (error) {
      toast.error('Failed to connect wallet');
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast.success('Wallet disconnected');
    navigate('/'); // Return to home page on disconnect
  };

  if (isConnected && walletAddress) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full">
          <Wallet className="w-4 h-4" />
          <span className="text-sm">
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </span>
        </div>
        <button
          onClick={handleDisconnect}
          className="text-gray-400 hover:text-white text-sm"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className="bg-primary text-background px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-75"
    >
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}