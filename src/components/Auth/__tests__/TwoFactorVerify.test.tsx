import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TwoFactorVerify } from '../TwoFactorVerify';
import { twoFactor } from '../../../lib/api/twoFactor';

// Mock twoFactor API
vi.mock('../../../lib/api/twoFactor', () => ({
  twoFactor: {
    validate2FA: vi.fn()
  }
}));

describe('TwoFactorVerify', () => {
  const mockOnSuccess = vi.fn();
  const mockUser = { id: 'test-user-id' };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mock('../../../contexts/AuthContext', () => ({
      useAuth: () => ({ user: mockUser })
    }));
  });

  test('renders verification form', () => {
    render(<TwoFactorVerify onSuccess={mockOnSuccess} />);
    
    expect(screen.getByText('Two-Factor Verification')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter 6-digit code')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /verify/i })).toBeInTheDocument();
  });

  test('handles successful verification', async () => {
    vi.mocked(twoFactor.validate2FA).mockResolvedValue(true);

    render(<TwoFactorVerify onSuccess={mockOnSuccess} />);
    
    fireEvent.change(screen.getByPlaceholderText('Enter 6-digit code'), {
      target: { value: '123456' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /verify/i }));
    
    await waitFor(() => {
      expect(twoFactor.validate2FA).toHaveBeenCalledWith(mockUser.id, '123456');
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  test('handles failed verification', async () => {
    vi.mocked(twoFactor.validate2FA).mockRejectedValue(new Error('Invalid code'));

    render(<TwoFactorVerify onSuccess={mockOnSuccess} />);
    
    fireEvent.change(screen.getByPlaceholderText('Enter 6-digit code'), {
      target: { value: '123456' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /verify/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Invalid code')).toBeInTheDocument();
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });

  test('validates code format', () => {
    render(<TwoFactorVerify onSuccess={mockOnSuccess} />);
    
    const verifyButton = screen.getByRole('button', { name: /verify/i });
    const input = screen.getByPlaceholderText('Enter 6-digit code');
    
    // Test with invalid length
    fireEvent.change(input, { target: { value: '12345' } });
    expect(verifyButton).toBeDisabled();
    
    // Test with valid length
    fireEvent.change(input, { target: { value: '123456' } });
    expect(verifyButton).not.toBeDisabled();
  });

  test('shows loading state during verification', async () => {
    vi.mocked(twoFactor.validate2FA).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<TwoFactorVerify onSuccess={mockOnSuccess} />);
    
    fireEvent.change(screen.getByPlaceholderText('Enter 6-digit code'), {
      target: { value: '123456' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /verify/i }));
    
    expect(screen.getByText('Verifying...')).toBeInTheDocument();
  });
});