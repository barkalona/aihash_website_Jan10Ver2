import React from 'react';
import { Link } from 'react-router-dom';
import ParticleBackground from './ParticleBackground';
import { useWallet } from '../../contexts/WalletContext';
import { useAuth } from '../../contexts/AuthContext';

interface HeroProps {
  onConnectWallet: () => void;
}

export function Hero({ onConnectWallet }: HeroProps) {
  const { isConnected } = useWallet();
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10 text-center px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#00FF9D] to-[#2D7FF9] text-transparent bg-clip-text">
          The Future of Decentralized Hash Power
        </h1>
        
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Trade computing power on the first truly decentralized hash marketplace. 
          Secure, efficient, and powered by blockchain technology.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isConnected ? (
            <Link 
              to="/dashboard"
              className="bg-[#00FF9D] text-[#0D1117] px-8 py-3 rounded-lg font-medium hover:bg-[#00FF9D]/90 transition-colors"
            >
              Launch App
            </Link>
          ) : (
            <button
              onClick={onConnectWallet}
              className="bg-[#00FF9D] text-[#0D1117] px-8 py-3 rounded-lg font-medium hover:bg-[#00FF9D]/90 transition-colors"
            >
              {user ? 'Connect Wallet' : 'Get Started'}
            </button>
          )}
          <Link
            to="/docs"
            className="border border-[#00FF9D] text-[#00FF9D] px-8 py-3 rounded-lg font-medium hover:bg-[#00FF9D]/10 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}