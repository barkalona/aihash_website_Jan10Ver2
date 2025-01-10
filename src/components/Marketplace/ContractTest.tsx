import React, { useState } from 'react';
import { walletIntegration } from '../../lib/blockchain/walletIntegration';

export function ContractTest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const handleMintToken = async () => {
    setLoading(true);
    setError('');
    try {
      const txHash = await walletIntegration.mintToken(100, 1000);
      setResult(`Transaction successful! Hash: ${txHash}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mint token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/50 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">Contract Integration Test</h2>
      
      {error && (
        <div className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-green-500/10 text-green-400 p-3 rounded-lg mb-4">
          {result}
        </div>
      )}

      <button
        onClick={handleMintToken}
        disabled={loading}
        className="bg-primary text-background px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Mint Test Token'}
      </button>
    </div>
  );
}