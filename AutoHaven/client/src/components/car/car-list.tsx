import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { CarCard, CarCardSkeleton } from "./car-card";
import { Car } from "@shared/schema";
import { DirectionsCar } from "@/components/ui/icons";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { trainModel } from "@/lib/car-scoring";

interface CarListProps {
  searchParams?: Record<string, any>;
  limit?: number;
  showFavoriteStatus?: boolean;
  hideEmptyState?: boolean;
}

export function CarList({
  searchParams = {},
  limit,
  showFavoriteStatus = true,
  hideEmptyState = false,
}: CarListProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch cars based on search params
  const {
    data: cars,
    isLoading: carsLoading,
    error,
  } = useQuery<Car[]>({
    queryKey: ["/api/cars", searchParams],
    queryFn: async () => {
      const queryString = new URLSearchParams();

      // Add all search params to query string
      for (const [key, value] of Object.entries(searchParams)) {
        if (value !== undefined && value !== "" && value !== null) {
          queryString.append(key, value.toString());
        }
      }

      const url = `/api/cars${queryString.toString() ? `?${queryString.toString()}` : ""}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch cars");
      }

      return response.json();
    },
  });

  useEffect(() => {
    if (cars && cars.length > 0) {
      trainModel(cars);
    }
  }, [cars]);

  // Fetch user's favorites if logged in
  const { data: favorites, isLoading: favoritesLoading } = useQuery({
    queryKey: ["/api/favorites"],
    queryFn: async () => {
      const response = await fetch("/api/favorites");

      if (!response.ok) {
        if (response.status === 401) {
          // Not logged in, return empty array
          return [];
        }
        throw new Error("Failed to fetch favorites");
      }

      return response.json();
    },
    enabled: !!user && showFavoriteStatus, // Only fetch if user is logged in
  });

  // Fetch reviews for better rating/review data
  const { data: reviewsData } = useQuery({
    queryKey: ["/api/reviews"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/reviews");
        if (!response.ok) {
          if (response.status === 404) return {};
          throw new Error("Failed to fetch reviews");
        }
        const reviews = await response.json();

        // Organize reviews by car ID
        const reviewsByCarId: Record<number, { count: number; avg: number }> =
          {};
        reviews.forEach((review: any) => {
          const carId = review.carId;
          if (!reviewsByCarId[carId]) {
            reviewsByCarId[carId] = { count: 0, avg: 0 };
          }
          reviewsByCarId[carId].count++;
          reviewsByCarId[carId].avg =
            (reviewsByCarId[carId].avg * (reviewsByCarId[carId].count - 1) +
              review.rating) /
            reviewsByCarId[carId].count;
        });

        return reviewsByCarId;
      } catch (error) {
        console.error("Error fetching reviews:", error);
        return {};
      }
    },
  });

  // Create a map of favorited car IDs for quick lookup
  const [favoritedCarIds, setFavoritedCarIds] = useState<Set<number>>(
    new Set(),
  );

  useEffect(() => {
    if (favorites && Array.isArray(favorites)) {
      const favIds = new Set(
        favorites.map((fav: any) => fav.car?.id).filter(Boolean),
      );
      setFavoritedCarIds(favIds);
    }
  }, [favorites]);

  // Show loading state with skeletons
  if (carsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <CarCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error loading listings
        </h3>
        <p className="text-gray-500 mb-4">
          We couldn't load the car listings. Please try again.
        </p>
        <Button onClick={() => window.location.reload()}>Refresh</Button>
      </div>
    );
  }

  // Show empty state if no cars
  if ((!cars || cars.length === 0) && !hideEmptyState) {
    return (
      <div className="text-center py-12 border rounded-lg bg-gray-50">
        <DirectionsCar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No cars found
        </h3>
        <p className="text-gray-500 mb-4">
          Try adjusting your search filters or check back later for new
          listings.
        </p>

        {Object.keys(searchParams).length > 0 && (
          <Button
            onClick={() => (window.location.href = "/cars")}
            variant="outline"
            className="mr-2"
          >
            Clear Filters
          </Button>
        )}

        {user && (
          <Link href="/cars/new">
            <Button className="mt-2">Sell Your Car</Button>
          </Link>
        )}
      </div>
    );
  }

  // Sort cars based on sort option
  let sortedCars = [...(cars || [])];
  const sortOption = searchParams.sort;

  if (sortOption) {
    sortedCars.sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return b.id - a.id;
        case "oldest":
          return a.id - b.id;
        case "price_low":
          return a.price - b.price;
        case "price_high":
          return b.price - a.price;
        case "mileage_low":
          return a.mileage - b.mileage;
        case "mileage_high":
          return b.mileage - a.mileage;
        default:
          return 0;
      }
    });
  }

  // Limit the number of cars if specified
  const displayedCars =
    limit && sortedCars ? sortedCars.slice(0, limit) : sortedCars;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayedCars?.map((car) => {
        // Get review data for this car if available
        const reviewData = reviewsData && reviewsData[car.id];
        const reviewCount = reviewData ? reviewData.count : 0;
        const averageRating = reviewData ? reviewData.avg : 0;

        return (
          <CarCard
            key={car.id}
            car={car}
            allCars={displayedCars}
            isFavorited={favoritedCarIds.has(car.id)}
            reviewCount={reviewCount}
            averageRating={averageRating}
          />
        );
      })}
    </div>
  );
}
