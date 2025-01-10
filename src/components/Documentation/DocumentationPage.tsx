import React from 'react';
import { Book, Code, Terminal, Cpu, Zap, Shield, Leaf, GitBranch, Key, Download, LifeBuoy, Github, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DocumentationPage() {
  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* White Paper Section */}
        <div className="mb-12 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl p-8 border border-primary/20">
          <div className="flex items-center gap-4 mb-6">
            <FileText className="w-10 h-10 text-primary" />
            <div>
              <h2 className="text-2xl font-bold text-white">White Paper</h2>
              <p className="text-gray-300">Decentralized AI-Powered Hashing Marketplace</p>
            </div>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-6">
              Explore our comprehensive white paper detailing the revolutionary platform that combines blockchain technology, 
              tokenized ownership, and AI-driven optimization for cryptocurrency mining. Built on Sui network, 
              the platform decentralizes ownership of mining operations through tokenization.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <h3 className="text-primary font-medium mb-2">Tokenized Ownership</h3>
                <p className="text-sm text-gray-400">Fractionalized mining operations with blockchain-based tokens</p>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <h3 className="text-primary font-medium mb-2">AI Optimization</h3>
                <p className="text-sm text-gray-400">Real-time analysis and predictive maintenance</p>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <h3 className="text-primary font-medium mb-2">Green Mining</h3>
                <p className="text-sm text-gray-400">Sustainable practices and carbon offset initiatives</p>
              </div>
            </div>

            <Link 
              to="/whitepaper"
              className="inline-flex items-center gap-2 bg-primary text-background px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Read White Paper
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Rest of the component remains unchanged */}
        {/* ... */}
      </div>
    </div>
  );
}