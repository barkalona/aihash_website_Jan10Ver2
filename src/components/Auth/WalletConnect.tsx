import React from 'react';
import { ConnectButton, useWalletKit } from '@mysten/wallet-kit';
import { Wallet } from 'lucide-react';

export function WalletConnect() {
  const { currentAccount } = useWalletKit();

  return (
    <div className="flex items-center gap-4">
      {currentAccount ? (
        <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full">
          <Wallet className="w-4 h-4" />
          <span className="text-sm font-medium">
            {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
          </span>
        </div>
      ) : (
        <ConnectButton className="bg-primary text-background px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors" />
      )}
    </div>
  );
}