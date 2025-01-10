import React from 'react';
import { Cpu } from 'lucide-react';

export function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Cpu className="w-16 h-16 text-[#00FF9D] mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">Welcome to aiHash</h1>
        <p className="text-gray-400">The future of decentralized mining</p>
      </div>
    </div>
  );
}