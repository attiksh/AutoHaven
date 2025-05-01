import { useQuery } from "@tanstack/react-query";
import { Car } from "@shared/schema";
import { CarCard } from "@/components/car/car-card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";

export default function FeaturedListings() {
  // Fetch featured cars (limit to 3 for home page)
  const { data: cars, isLoading } = useQuery<Car[]>({
    queryKey: ["/api/cars", { limit: 3 }],
    queryFn: async () => {
      const response = await fetch("/api/cars?limit=3");
      if (!response.ok) {
        throw new Error("Failed to fetch featured cars");
      }
      return response.json();
    },
  });

  // Sample car data for when the API doesn't return any cars
  const sampleCars: Car[] = [
    {
      id: 1,
      userId: 2,
      title: "Tesla Model 3 - Autopilot & Premium Audio",
      make: "Tesla",
      model: "Model 3",
      year: 2022,
      price: 42900,
      mileage: 12500,
      condition: "excellent",
      fuel: "electric",
      transmission: "automatic",
      description: "Like new condition, fully loaded with all features including Autopilot. Premium white interior with minimal wear.",
      features: ["Autopilot", "Quick Charging", "Premium Audio"],
      location: "San Francisco, CA",
      images: ["https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=350&q=80"],
      createdAt: new Date(),
    },
    {
      id: 2,
      userId: 3,
      title: "BMW 3 Series - Sport Package & Luxury Features",
      make: "BMW",
      model: "3 Series",
      year: 2021,
      price: 38500,
      mileage: 18350,
      condition: "good",
      fuel: "gasoline",
      transmission: "automatic",
      description: "Well-maintained BMW 3 Series with M Sport package. Clean history report, no accidents.",
      features: ["Sport Package", "Leather", "Navigation"],
      location: "Los Angeles, CA",
      images: ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=350&q=80"],
      createdAt: new Date(),
    },
    {
      id: 3,
      userId: 4,
      title: "Audi Q5 - Quattro AWD & Panoramic Roof",
      make: "Audi",
      model: "Q5",
      year: 2022,
      price: 45800,
      mileage: 9120,
      condition: "like_new",
      fuel: "gasoline",
      transmission: "automatic",
      description: "Barely driven Audi Q5 with premium features and warranty still active. Panoramic sunroof and all-wheel drive.",
      features: ["Quattro AWD", "Panoramic Roof", "Premium Plus"],
      location: "Chicago, IL",
      images: ["https://images.unsplash.com/photo-1609521263047-f8f205293f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=350&q=80"],
      createdAt: new Date(),
    },
  ];

  // Display sample data if API returns empty or loading
  const displayCars = (cars && cars.length > 0) ? cars : sampleCars;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Featured Vehicles</h2>
          <Link href="/cars">
            <Button variant="link" className="text-primary hover:text-primary/90 font-medium">
              View all
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {displayCars.map((car, index) => (
              <CarCard
                key={car.id || index} // Use index as fallback for sample data
                car={car}
                reviewCount={Math.floor(Math.random() * 30) + 5} // Sample review count
                averageRating={4 + Math.random()} // Sample rating between 4.0-5.0
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
