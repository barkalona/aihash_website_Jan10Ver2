import { describe, test, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useWebSocket } from '../../hooks/useWebSocket';
import { websocketManager } from '../../lib/websocket';
import { rateLimit } from '../../lib/rateLimit';

// Mock dependencies
vi.mock('../../lib/websocket', () => ({
  websocketManager: {
    subscribeToPriceUpdates: vi.fn(),
    subscribeToListing: vi.fn(),
    subscribeToOrderUpdates: vi.fn()
  }
}));

vi.mock('../../lib/rateLimit', () => ({
  rateLimit: {
    websocket: {
      checkLimit: vi.fn()
    }
  }
}));

describe('useWebSocket', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('subscribes to price updates', () => {
    const mockCallback = vi.fn();
    vi.mocked(rateLimit.websocket.checkLimit).mockResolvedValue(true);

    const { result } = renderHook(() => useWebSocket());
    result.current.subscribeToPrices(mockCallback);

    expect(websocketManager.subscribeToPriceUpdates).toHaveBeenCalled();
  });

  test('subscribes to listing updates', () => {
    const mockCallback = vi.fn();
    const listingId = 'test-listing';
    vi.mocked(rateLimit.websocket.checkLimit).mockResolvedValue(true);

    const { result } = renderHook(() => useWebSocket());
    result.current.subscribeToListing(listingId, mockCallback);

    expect(websocketManager.subscribeToListing).toHaveBeenCalledWith(
      listingId,
      expect.any(Function)
    );
  });

  test('subscribes to order updates', () => {
    const mockCallback = vi.fn();
    const orderId = 'test-order';
    vi.mocked(rateLimit.websocket.checkLimit).mockResolvedValue(true);

    const { result } = renderHook(() => useWebSocket());
    result.current.subscribeToOrder(orderId, mockCallback);

    expect(websocketManager.subscribeToOrderUpdates).toHaveBeenCalledWith(
      orderId,
      expect.any(Function)
    );
  });

  test('respects rate limits', async () => {
    const mockCallback = vi.fn();
    vi.mocked(rateLimit.websocket.checkLimit).mockResolvedValue(false);

    const { result } = renderHook(() => useWebSocket());
    const unsubscribe = result.current.subscribeToPrices(mockCallback);

    const mockPayload = { price: 100 };
    const wrappedCallback = vi.mocked(websocketManager.subscribeToPriceUpdates).mock.calls[0][0];
    await wrappedCallback(mockPayload);

    expect(mockCallback).not.toHaveBeenCalled();
    expect(rateLimit.websocket.checkLimit).toHaveBeenCalledWith('price_updates');

    // Test cleanup
    unsubscribe();
  });
});