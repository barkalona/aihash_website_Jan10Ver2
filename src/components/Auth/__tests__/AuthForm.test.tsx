import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthForm } from '../AuthForm';
import { AuthProvider } from '../../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

// Mock AuthContext
vi.mock('../../../contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => ({
    signIn: vi.fn().mockResolvedValue(undefined),
    signUp: vi.fn().mockResolvedValue(undefined),
  })
}));

describe('AuthForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders sign in form by default', () => {
    render(<AuthForm />);
    
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('toggles between sign in and sign up', () => {
    render(<AuthForm />);
    
    // Initially shows sign in
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    
    // Click to switch to sign up
    fireEvent.click(screen.getByText(/don't have an account\? sign up/i));
    
    // Now shows sign up
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('handles form submission for sign in', async () => {
    const mockSignIn = vi.fn().mockResolvedValue(undefined);
    vi.mock('../../../contexts/AuthContext', () => ({
      useAuth: () => ({ signIn: mockSignIn }),
    }));

    render(<AuthForm />);
    
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  test('displays error message on failed sign in', async () => {
    const mockSignIn = vi.fn().mockRejectedValue(new Error('Invalid credentials'));
    vi.mock('../../../contexts/AuthContext', () => ({
      useAuth: () => ({ signIn: mockSignIn }),
    }));

    render(<AuthForm />);
    
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpassword' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  test('validates email format', async () => {
    render(<AuthForm />);
    
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'invalid-email' }
    });
    
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
  });

  test('shows loading state during submission', async () => {
    const mockSignIn = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    vi.mock('../../../contexts/AuthContext', () => ({
      useAuth: () => ({ signIn: mockSignIn }),
    }));

    render(<AuthForm />);
    
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });
});