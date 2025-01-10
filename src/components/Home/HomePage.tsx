import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ArrowRight } from 'lucide-react';

export function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-3xl">
        <Cpu className="w-16 h-16 text-[#00FF9D] mx-auto mb-6" />
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#00FF9D] to-[#2D7FF9] text-transparent bg-clip-text">
          The Future of Decentralized Mining
        </h1>
        <p className="text-gray-400 text-lg md:text-xl mb-8">
          Trade computing power on the first truly decentralized hash marketplace. 
          Secure, efficient, and powered by blockchain technology.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/marketplace"
            className="bg-[#00FF9D] text-[#0D1117] px-8 py-3 rounded-lg font-medium hover:bg-[#00FF9D]/90 transition-colors inline-flex items-center justify-center gap-2"
          >
            Explore Marketplace
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/auth"
            className="border border-[#00FF9D] text-[#00FF9D] px-8 py-3 rounded-lg font-medium hover:bg-[#00FF9D]/10 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}