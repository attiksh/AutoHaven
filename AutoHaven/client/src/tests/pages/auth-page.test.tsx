import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/tests/test-utils';
import AuthPage from '@/pages/auth-page';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';

// Mock the useAuth hook
vi.mock('@/hooks/use-auth', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the wouter useLocation hook
vi.mock('wouter', () => ({
  useLocation: vi.fn(),
  Link: ({ href, children, className }: any) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

describe('AuthPage component', () => {
  const mockLoginMutate = vi.fn();
  const mockRegisterMutate = vi.fn();
  const mockNavigate = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock useAuth
    (useAuth as any).mockReturnValue({
      user: null,
      loginMutation: {
        mutate: mockLoginMutate,
        isPending: false,
      },
      registerMutation: {
        mutate: mockRegisterMutate,
        isPending: false,
      },
    });
    
    // Mock useLocation
    (useLocation as any).mockReturnValue(['/', mockNavigate]);
  });
  
  it('redirects to home if user is already logged in', async () => {
    // Mock a logged-in user
    (useAuth as any).mockReturnValue({
      user: { id: 1, username: 'testuser' },
      loginMutation: { mutate: mockLoginMutate },
      registerMutation: { mutate: mockRegisterMutate },
    });
    
    render(<AuthPage />);
    
    // Check if navigate was called to redirect to home
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
  
  it('renders the login form by default', () => {
    render(<AuthPage />);
    
    // Check that we're on the login tab
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByText('Sign in to your AutoHaven account')).toBeInTheDocument();
    
    // Verify login form fields
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });
  
  it('renders login and register tabs', () => {
    render(<AuthPage />);
    
    // Verify both tabs exist
    const loginTab = screen.getByRole('tab', { name: /Login/i });
    const registerTab = screen.getByRole('tab', { name: /Register/i });
    
    expect(loginTab).toBeInTheDocument();
    expect(registerTab).toBeInTheDocument();
    
    // Verify login tab is active by default
    expect(loginTab.getAttribute('aria-selected')).toBe('true');
  });
  
  it('submits the login form with valid data', async () => {
    render(<AuthPage />);
    
    // Fill out the login form
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    
    // Check if loginMutation.mutate was called with the correct data
    await waitFor(() => {
      expect(mockLoginMutate).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
      });
    });
  });
  
  it('validates the login form before submission', async () => {
    render(<AuthPage />);
    
    // Submit the form without filling it out
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText('Username is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
    
    // Verify that loginMutation.mutate was not called
    expect(mockLoginMutate).not.toHaveBeenCalled();
  });
  
  it('shows login button in a disabled state during submission', async () => {
    // Set isPending to true for loginMutation
    (useAuth as any).mockReturnValue({
      user: null,
      loginMutation: {
        mutate: mockLoginMutate,
        isPending: true,
      },
      registerMutation: {
        mutate: mockRegisterMutate,
        isPending: false,
      },
    });
    
    render(<AuthPage />);
    
    // Check that the login button is disabled
    const loginButton = screen.getByRole('button', { name: /Sign In/i });
    expect(loginButton).toBeDisabled();
  });
});