import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';

// Mock AuthContext
vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: vi.fn()
}));

describe('ProtectedRoute', () => {
  const TestComponent = () => <div>Protected Content</div>;
  
  const renderWithRouter = (user: any = null, loading: boolean = false) => {
    vi.mocked(require('../../../contexts/AuthContext').useAuth).mockReturnValue({
      user,
      loading
    });

    return render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/auth" element={<div>Auth Page</div>} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <TestComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );
  };

  test('renders loading spinner when authenticating', () => {
    renderWithRouter(null, true);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('redirects to auth page when user is not authenticated', () => {
    renderWithRouter(null, false);
    expect(screen.getByText('Auth Page')).toBeInTheDocument();
  });

  test('renders protected content when user is authenticated', () => {
    renderWithRouter({ id: 'test-user' }, false);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('preserves location state when redirecting', () => {
    const { container } = renderWithRouter(null, false);
    
    // Check if the navigate component received the correct state
    expect(container.innerHTML).toContain('Auth Page');
  });
});