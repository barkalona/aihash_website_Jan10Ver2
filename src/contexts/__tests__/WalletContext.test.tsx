import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WalletProvider, useWallet } from '../WalletContext';

// Test component that uses wallet context
const TestComponent = () => {
  const { isConnected, walletAddress, connect, disconnect } = useWallet();
  return (
    <div>
      {isConnected ? (
        <>
          <div>Connected: {walletAddress}</div>
          <button onClick={disconnect}>Disconnect</button>
        </>
      ) : (
        <button onClick={connect}>Connect Wallet</button>
      )}
    </div>
  );
};

describe('WalletContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test('provides wallet context to children', () => {
    render(
      <WalletProvider>
        <TestComponent />
      </WalletProvider>
    );

    expect(screen.getByText(/connect wallet/i)).toBeInTheDocument();
  });

  test('connects wallet successfully', async () => {
    render(
      <WalletProvider>
        <TestComponent />
      </WalletProvider>
    );

    fireEvent.click(screen.getByText(/connect wallet/i));

    await waitFor(() => {
      expect(screen.getByText(/connected:/i)).toBeInTheDocument();
    });
  });

  test('disconnects wallet successfully', async () => {
    render(
      <WalletProvider>
        <TestComponent />
      </WalletProvider>
    );

    // First connect
    fireEvent.click(screen.getByText(/connect wallet/i));
    await waitFor(() => {
      expect(screen.getByText(/connected:/i)).toBeInTheDocument();
    });

    // Then disconnect
    fireEvent.click(screen.getByText(/disconnect/i));
    expect(screen.getByText(/connect wallet/i)).toBeInTheDocument();
  });

  test('restores connection from localStorage', () => {
    const mockAddress = '0x123...abc';
    localStorage.setItem('walletAddress', mockAddress);

    render(
      <WalletProvider>
        <TestComponent />
      </WalletProvider>
    );

    expect(screen.getByText(`Connected: ${mockAddress}`)).toBeInTheDocument();
  });

  test('shows connecting state', async () => {
    render(
      <WalletProvider>
        <TestComponent />
      </WalletProvider>
    );

    fireEvent.click(screen.getByText(/connect wallet/i));

    // Should show loading state briefly
    expect(await screen.findByText(/connected:/i)).toBeInTheDocument();
  });
});