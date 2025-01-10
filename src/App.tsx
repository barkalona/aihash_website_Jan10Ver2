import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { WalletProvider } from './contexts/WalletContext';
import { Header } from './components/Layout/Header';
import { MarketplacePage } from './components/Marketplace/MarketplacePage';
import { HomePage } from './components/Home/HomePage';
import { ErrorBoundary } from './components/UI/ErrorBoundary';
import { AuthPage } from './components/Auth/AuthPage';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <WalletProvider>
          <Router>
            <div className="min-h-screen bg-[#0D1117] text-white">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/marketplace" element={<MarketplacePage />} />
                </Routes>
              </main>
              <Toaster
                position="top-right"
                toastOptions={{
                  className: 'bg-gray-900 text-white',
                  duration: 4000,
                  style: {
                    background: '#1A202C',
                    color: '#fff',
                    border: '1px solid #2D3748'
                  },
                }}
              />
            </div>
          </Router>
        </WalletProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}