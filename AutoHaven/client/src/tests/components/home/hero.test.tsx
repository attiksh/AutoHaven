import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/tests/test-utils';
import Hero from '@/components/home/hero';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

// Mock dependencies
vi.mock('@/hooks/use-auth', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(),
}));

// Mock window.location
const mockLocation = { href: '' };
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

describe('Hero component', () => {
  const mockToast = { toast: vi.fn() };
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock setup
    (useAuth as any).mockReturnValue({ user: null });
    (useToast as any).mockReturnValue(mockToast);
    
    // Reset window.location.href
    mockLocation.href = '';
  });
  
  it('renders the hero section with headline and search box', () => {
    render(<Hero />);
    
    // Check for main elements
    expect(screen.getByText('Find Your Perfect Drive')).toBeInTheDocument();
    expect(
      screen.getByText(/Join thousands of satisfied customers who found their dream cars on AutoHaven/i)
    ).toBeInTheDocument();
    expect(screen.getByText('Find Your Dream Car')).toBeInTheDocument();
  
    // Check for search input
    expect(screen.getByPlaceholderText(/e.g., Tesla Model 3, Toyota Hybrid/)).toBeInTheDocument();
  
    // Check for search button
    expect(screen.getByRole('button', { name: 'Search Cars' })).toBeInTheDocument();
  
    // Check for advanced search link
    expect(screen.getByRole('link', { name: 'Advanced Search' })).toBeInTheDocument();
  });
  
  it('performs a search when the form is submitted with a search term', () => {
    render(<Hero />);
    
    // Get search input and search button
    const searchInput = screen.getByPlaceholderText(/e.g., Tesla Model 3, Toyota Hybrid/);
    const searchButton = screen.getByRole('button', { name: 'Search Cars' });
    
    // Enter a search term
    fireEvent.change(searchInput, { target: { value: 'Toyota Camry' } });
    
    // Submit the form
    fireEvent.click(searchButton);
    
    // Check if navigation occurred to the correct URL
    expect(mockLocation.href).toBe('/cars?keyword=Toyota%20Camry');
  });
  
  it('shows a toast error when submitting without a search term', () => {
    render(<Hero />);
    
    // Get search button
    const searchButton = screen.getByRole('button', { name: 'Search Cars' });
    
    // Submit the form without entering a search term
    fireEvent.click(searchButton);
    
    // Check if toast was called with the correct error
    expect(mockToast.toast).toHaveBeenCalledWith({
      title: 'Search term required',
      description: 'Please enter a make, model, or keyword to search',
      variant: 'destructive',
    });
    
    // Navigation should not have occurred
    expect(mockLocation.href).toBe('');
  });
  
  it('navigates to advanced search when clicking the link', () => {
    render(<Hero />);
    
    // Get advanced search link
    const advancedSearchLink = screen.getByRole('link', { name: 'Advanced Search' });
    
    // Check that the link has the correct href
    expect(advancedSearchLink).toHaveAttribute('href', '/cars');
  });
});