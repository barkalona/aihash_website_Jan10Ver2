import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { ConnectWalletButton } from '../Wallet/ConnectWalletButton';
import { useWallet } from '../../contexts/WalletContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isConnected } = useWallet();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/auth');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-[#0D1117]/80 backdrop-blur-lg' : 'bg-[#0D1117]'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link to={isConnected && user ? '/dashboard' : '/'} className="text-2xl font-bold text-white">
            aiHash
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/marketplace" className="text-gray-300 hover:text-white">Marketplace</Link>
            <Link to="/governance" className="text-gray-300 hover:text-white">Governance</Link>
            <Link to="/stats" className="text-gray-300 hover:text-white">Statistics</Link>
            <Link to="/docs" className="text-gray-300 hover:text-white">Documentation</Link>
            {isConnected && user && (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-primary hover:text-primary/80"
              >
                <LayoutDashboard className="w-4 h-4" />
                Mining Center
              </Link>
            )}
            <ConnectWalletButton />
            {user && (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-gray-300 hover:text-white"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            )}
          </nav>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0D1117]">
          <div className="px-4 py-2 space-y-1">
            <Link to="/marketplace" className="block px-3 py-2 text-gray-300 hover:text-white">Marketplace</Link>
            <Link to="/governance" className="block px-3 py-2 text-gray-300 hover:text-white">Governance</Link>
            <Link to="/stats" className="block px-3 py-2 text-gray-300 hover:text-white">Statistics</Link>
            <Link to="/docs" className="block px-3 py-2 text-gray-300 hover:text-white">Documentation</Link>
            {isConnected && user && (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-3 py-2 text-primary hover:text-primary/80"
              >
                <LayoutDashboard className="w-4 h-4" />
                Mining Center
              </Link>
            )}
            <div className="px-3 py-2">
              <ConnectWalletButton />
            </div>
            {user && (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white w-full"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}