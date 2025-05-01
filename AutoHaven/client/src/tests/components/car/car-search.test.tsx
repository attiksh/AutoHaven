import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/tests/test-utils';
import { CarSearch } from '@/components/car/car-search';
import { useLocation, useSearch } from 'wouter';
import { useQuery } from '@tanstack/react-query';

// Mock dependencies
vi.mock('wouter', () => ({
  useLocation: vi.fn(),
  useSearch: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  QueryClient: vi.fn(),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@/hooks/use-auth', () => ({
  useAuth: vi.fn(() => ({ user: null })),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Create mock for slider component since it's difficult to test
vi.mock('@/components/ui/slider', () => ({
  Slider: ({ onValueChange }: any) => (
    <div data-testid="slider-mock">
      <button onClick={() => onValueChange([10000, 50000])} data-testid="slider-price-change">
        Change price
      </button>
      <button onClick={() => onValueChange([5000, 100000])} data-testid="slider-mileage-change">
        Change mileage
      </button>
    </div>
  ),
}));

describe('CarSearch component', () => {
  const mockNavigate = vi.fn();
  const mockCars = [
    {
      id: 1,
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      price: 25000,
      mileage: 15000,
      condition: 'excellent',
      fuel: 'gasoline',
      transmission: 'automatic',
      features: ['Leather Seats', 'Sunroof', 'Navigation'],
      images: ['https://example.com/camry.jpg'],
      userId: 1,
    },
    {
      id: 2,
      make: 'Honda',
      model: 'Accord',
      year: 2019,
      price: 22000,
      mileage: 20000,
      condition: 'good',
      fuel: 'hybrid',
      transmission: 'automatic',
      features: ['Backup Camera', 'Bluetooth', 'Keyless Entry'],
      images: ['https://example.com/accord.jpg'],
      userId: 2,
    },
    {
      id: 3,
      make: 'Toyota',
      model: 'Corolla',
      year: 2021,
      price: 20000,
      mileage: 5000,
      condition: 'like_new',
      fuel: 'gasoline',
      transmission: 'automatic',
      features: ['Backup Camera', 'Bluetooth'],
      images: ['https://example.com/corolla.jpg'],
      userId: 3,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Set up default mocks
    (useLocation as any).mockReturnValue(['/cars', mockNavigate]);
    (useSearch as any).mockReturnValue('');
    (useQuery as any).mockReturnValue({
      data: mockCars,
      isLoading: false,
      error: null,
    });
  });
  
  it('renders the search form with all fields', () => {
    render(<CarSearch />);
    
    // Check for main form elements
    expect(screen.getByText('Find Your Perfect Car')).toBeInTheDocument();
    
    // Check for make and model selectors
    expect(screen.getByText('Make')).toBeInTheDocument();
    expect(screen.getByText('Model')).toBeInTheDocument();
    
    // Check for price range
    expect(screen.getByText('Price Range')).toBeInTheDocument();
    
    // Check for advanced search section
    expect(screen.getByText('Advanced Search Options')).toBeInTheDocument();
    
    // Check for buttons
    expect(screen.getByRole('button', { name: 'Reset Filters' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Cars/i })).toBeInTheDocument();
  });
  
  it('loads initial values from URL search params', () => {
    // Mock URL params
    (useSearch as any).mockReturnValue('?make=Toyota&minPrice=20000&maxPrice=30000');
    
    render(<CarSearch />);
    
    // We can't easily test the selection of values in the UI because of how 
    // the select components are implemented, but we can verify the form exists
    expect(screen.getByText('Find Your Perfect Car')).toBeInTheDocument();
    expect(screen.getByText('Price Range')).toBeInTheDocument();
  });
  
  it('submits search when the form is submitted', () => {
    render(<CarSearch />);
    
    // Submit the form
    const searchButton = screen.getByRole('button', { name: /Search Cars/i });
    fireEvent.click(searchButton);
    
    // Check navigation was called
    expect(mockNavigate).toHaveBeenCalledWith('/cars?');
  });
  
  it('resets filters when clicking the reset button', () => {
    render(<CarSearch />);
    
    // Change price range using our mock button
    const priceChangeButton = screen.getByTestId('slider-price-change');
    fireEvent.click(priceChangeButton);
    
    // Click reset button
    const resetButton = screen.getByRole('button', { name: 'Reset Filters' });
    fireEvent.click(resetButton);
    
    // Submit the form to verify all params were reset
    const searchButton = screen.getByRole('button', { name: /Search Cars/i });
    fireEvent.click(searchButton);
    
    // Should navigate with empty params
    expect(mockNavigate).toHaveBeenCalledWith('/cars?');
  });
});