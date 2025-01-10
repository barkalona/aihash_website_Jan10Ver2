import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authSchema, signUpSchema } from '../../lib/validation/auth';
import { toast } from 'react-hot-toast';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { z } from 'zod';

export function AuthForm() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    try {
      // Use different validation schemas for sign in and sign up
      const schema = isSignUp ? signUpSchema : authSchema;
      schema.parse(formData);

      setLoading(true);
      if (isSignUp) {
        await signUp(formData.email, formData.password);
        toast.success('Account created successfully! Please check your email.');
      } else {
        await signIn(formData.email, formData.password);
        toast.success('Welcome back!');
        navigate('/dashboard');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0].toString()] = err.message;
          }
        });
        setValidationErrors(errors);
      } else if (error instanceof Error) {
        const message = error.message.toLowerCase();
        if (message.includes('invalid login credentials')) {
          setValidationErrors({ auth: 'Invalid email or password. Please try again.' });
        } else if (message.includes('already registered')) {
          setValidationErrors({ auth: 'This email is already registered. Please sign in instead.' });
        } else {
          setValidationErrors({ auth: error.message });
        }
      } else {
        setValidationErrors({ auth: 'An unexpected error occurred. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-gray-900/50 p-8 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>

        {validationErrors.auth && (
          <div className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{validationErrors.auth}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-800 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            {validationErrors.email && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {validationErrors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-gray-800 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            {validationErrors.password && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {validationErrors.password}
              </p>
            )}
          </div>

          {!isSignUp && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => navigate('/auth/reset-password')}
                className="text-sm text-primary hover:text-primary/80"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-background py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setValidationErrors({});
            setFormData({ email: '', password: '' });
          }}
          className="w-full text-center mt-4 text-gray-400 hover:text-white"
        >
          {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  );
}