import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthForm } from './AuthForm';
import { TwoFactorVerify } from './TwoFactorVerify';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../UI/LoadingSpinner';

export function AuthPage() {
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const { loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-md mx-auto px-4">
        {showTwoFactor ? (
          <TwoFactorVerify
            onSuccess={() => {
              navigate(from, { replace: true });
            }}
          />
        ) : (
          <AuthForm
            onTwoFactorRequired={() => setShowTwoFactor(true)}
            onSuccess={() => navigate(from, { replace: true })}
          />
        )}
      </div>
    </div>
  );
}