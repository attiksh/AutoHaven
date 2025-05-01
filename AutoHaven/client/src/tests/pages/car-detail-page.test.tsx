import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/tests/test-utils';
import CarDetailPage from '@/pages/car-detail-page';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// Mock dependencies
vi.mock('wouter', () => ({
  useParams: vi.fn(),
  useLocation: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => {
  const QueryClient = vi.fn().mockImplementation(() => ({
    invalidateQueries: vi.fn(),
  }));

  return {
    useQuery: vi.fn(),
    useMutation: vi.fn(() => ({
      mutate: vi.fn(),
      isPending: false,
    })),
    QueryClient,
    QueryClientProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

vi.mock('@/hooks/use-auth', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(),
}));

vi.mock('@/lib/queryClient', () => ({
  apiRequest: vi.fn(),
  queryClient: {
    invalidateQueries: vi.fn(),
  },
}));

// Mock UI components
vi.mock('@/components/ui/carousel', () => ({
  Carousel: ({ children }: any) => <div data-testid="carousel">{children}</div>,
  CarouselContent: ({ children }: any) => <div>{children}</div>,
  CarouselItem: ({ children }: any) => <div>{children}</div>,
  CarouselNext: () => <button>Next</button>,
  CarouselPrevious: () => <button>Previous</button>,
}));

describe('CarDetailPage', () => {
  const mockCar = {
    id: 1,
    title: '2020 Toyota Camry XSE - Low Miles, Like New',
    userId: 1,
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    price: 25900,
    mileage: 15000,
    condition: 'excellent',
    fuel: 'gasoline',
    transmission: 'automatic',
    description: 'Beautiful Toyota Camry XSE with premium features including leather seats, panoramic sunroof, and advanced safety features.',
    location: 'Seattle, WA',
    features: ['Leather Seats', 'Sunroof', 'Backup Camera', 'Bluetooth', 'Navigation'],
    images: ['https://example.com/car1.jpg', 'https://example.com/car2.jpg'],
    createdAt: new Date().toISOString(),
  };

  const mockReviews = [
    {
      id: 1,
      userId: 2,
      carId: 1,
      rating: 4,
      comment: 'Great car, very comfortable and reliable.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      userId: 3,
      carId: 1,
      rating: 5,
      comment: 'Amazing vehicle, exceeded my expectations!',
      createdAt: new Date().toISOString(),
    },
  ];

  const mockUser = {
    id: 2,
    username: 'testuser',
    email: 'user@example.com',
    name: 'Test User',
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock routing, auth, toast
    (useParams as any).mockReturnValue({ id: '1' });
    (useLocation as any).mockReturnValue(['/cars/1', vi.fn()]);
    (useAuth as any).mockReturnValue({ user: mockUser });
    (useToast as any).mockReturnValue({ toast: vi.fn() });

    // First 4 useQuery calls
    (useQuery as any)
      .mockReturnValueOnce({ data: mockCar, isLoading: false, error: null }) // Car details
      .mockReturnValueOnce({ data: mockReviews, isLoading: false, error: null }) // Reviews
      .mockReturnValueOnce({
        data: { id: 1, username: 'seller', email: 'seller@example.com' },
        isLoading: false,
        error: null,
      }) // Seller
      .mockReturnValueOnce({
        data: [
          {
            id: 2,
            title: '2019 Toyota Camry LE',
            userId: 3,
            make: 'Toyota',
            model: 'Camry',
            price: 22000,
            mileage: 25000,
            condition: 'good',
            images: ['https://example.com/car3.jpg'],
          },
        ],
        isLoading: false,
        error: null,
      }); // Similar Cars

    // Fallback for unexpected useQuery calls
    (useQuery as any).mockImplementation(() => ({
      data: undefined,
      isLoading: false,
      error: null,
    }));
  });

  it('renders the car details when data is loaded', () => {
    render(<CarDetailPage />);

    // Car title
    expect(screen.getByText('2020 Toyota Camry XSE - Low Miles, Like New')).toBeInTheDocument();

    // Price
    expect(screen.getByText('$25,900')).toBeInTheDocument();

    // Tabs
    expect(screen.getByRole('tab', { name: 'Details' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Features' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Reviews' })).toBeInTheDocument();
  });
});