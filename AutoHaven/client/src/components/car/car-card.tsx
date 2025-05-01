import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import {
  Heart,
  HeartFilled,
  Check,
  DirectionsCar,
} from "@/components/ui/icons";
import { Mail, Loader2 } from "lucide-react";
import { Car } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

// Collection of car images by type and brand
const carImageMap: Record<string, Record<string, string[]>> = {
  // Images by car type
  type: {
    sedan: [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=3024",
      "https://images.unsplash.com/photo-1549058202-b9c5bc80d887?auto=format&fit=crop&q=80&w=2969",
      "https://images.unsplash.com/photo-1549317661-bd32c8017f8d?auto=format&fit=crop&q=80&w=3070"
    ],
    suv: [
      "https://images.unsplash.com/photo-1599912027611-484b9fc447af?auto=format&fit=crop&q=80&w=3069",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=2970",
      "https://images.unsplash.com/photo-1616806569992-a9b18ed8c4da?auto=format&fit=crop&q=80&w=2970"
    ],
    truck: [
      "https://images.unsplash.com/photo-1571987502227-9231b837d92a?auto=format&fit=crop&q=80&w=2940",
      "https://images.unsplash.com/photo-1569017388730-020b5f80a004?auto=format&fit=crop&q=80&w=2940",
      "https://images.unsplash.com/photo-1596449014052-ca369d8149a2?auto=format&fit=crop&q=80&w=2940"
    ],
    sports: [
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=3147",
      "https://images.unsplash.com/photo-1602776256868-dd8ef752ba5c?auto=format&fit=crop&q=80&w=2426",
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=2650"
    ],
    convertible: [
      "https://images.unsplash.com/photo-1617469767053-ca22a93a7a8f?auto=format&fit=crop&q=80&w=2970",
      "https://images.unsplash.com/photo-1603553329474-99f95f35394f?auto=format&fit=crop&q=80&w=2940",
      "https://images.unsplash.com/photo-1544105436-9a7e32cdabba?auto=format&fit=crop&q=80&w=2952"
    ],
    coupe: [
      "https://images.unsplash.com/photo-1592840062661-a5a7f78e2056?auto=format&fit=crop&q=80&w=2974",
      "https://images.unsplash.com/photo-1514867644123-6385d58d3cd4?auto=format&fit=crop&q=80&w=2960",
      "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=2970"
    ],
    electric: [
      "https://images.unsplash.com/photo-1593941707882-a5bba53b5999?auto=format&fit=crop&q=80&w=2972",
      "https://images.unsplash.com/photo-1617704548623-340376564e68?auto=format&fit=crop&q=80&w=2970",
      "https://images.unsplash.com/photo-1616455263544-695d4998e1d1?auto=format&fit=crop&q=80&w=2971"
    ],
    luxury: [
      "https://images.unsplash.com/photo-1583267746897-2cf415887172?auto=format&fit=crop&q=80&w=2940",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=2940",
      "https://images.unsplash.com/photo-1614200179396-2bdb77383522?auto=format&fit=crop&q=80&w=3024"
    ],
    minivan: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=2970",
      "https://images.unsplash.com/photo-1548686013-c0893dc2ed36?auto=format&fit=crop&q=80&w=3087",
      "https://images.unsplash.com/photo-1591439657848-9f4b9ce3b34b?auto=format&fit=crop&q=80&w=2940"
    ],
    hatchback: [
      "https://images.unsplash.com/photo-1590510176997-da2418a5d4e7?auto=format&fit=crop&q=80&w=2934",
      "https://images.unsplash.com/photo-1477862096227-3a1bb3b08330?auto=format&fit=crop&q=80&w=2940",
      "https://images.unsplash.com/photo-1572811983770-881b4fdb5aff?auto=format&fit=crop&q=80&w=2944"
    ],
    hybrid: [
      "https://images.unsplash.com/photo-1610647752706-3bb12232b3e4?auto=format&fit=crop&q=80&w=2650",
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=2942",
      "https://images.unsplash.com/photo-1634118520179-0c78b72df69a?auto=format&fit=crop&q=80&w=2787"
    ]
  },

  // Images by car brand
  brand: {
    toyota: [
      "https://images.unsplash.com/photo-1632245889029-e406faaa34cd?auto=format&fit=crop&q=80&w=3132",
      "https://images.unsplash.com/photo-1621007947782-be4e5341d0db?auto=format&fit=crop&q=80&w=2940",
      "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&q=80&w=2787"
    ],
    honda: [
      "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&q=80&w=2574",
      "https://images.unsplash.com/photo-1606152420003-beaad4e31abc?auto=format&fit=crop&q=80&w=2940",
      "https://images.unsplash.com/photo-1583267682087-9e3437dbe9f6?auto=format&fit=crop&q=80&w=2940"
    ],
    ford: [
      "https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&q=80&w=2940",
      "https://images.unsplash.com/photo-1604599322657-3195cd7224af?auto=format&fit=crop&q=80&w=2940",
      "https://images.unsplash.com/photo-1584345604325-f5308316a955?auto=format&fit=crop&q=80&w=2940"
    ],
    bmw: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=2940",
      "https://images.unsplash.com/photo-1556800572-1b8aeef2c54f?auto=format&fit=crop&q=80&w=2942",
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=2940"
    ],
    mercedes: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=2940",
      "https://images.unsplash.com/photo-1605515298946-d663d98ddfd7?auto=format&fit=crop&q=80&w=2787",
      "https://images.unsplash.com/photo-1622194993799-3120c8a8c0cd?auto=format&fit=crop&q=80&w=2874"
    ],
    audi: [
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=2940",
      "https://images.unsplash.com/photo-1612468008274-9445bd56161e?auto=format&fit=crop&q=80&w=2940",
      "https://images.unsplash.com/photo-1606220838315-056192d5e927?auto=format&fit=crop&q=80&w=2940"
    ],
    tesla: [
      "https://images.unsplash.com/photo-1562422321-e18127d10876?auto=format&fit=crop&q=80&w=2940",
      "https://images.unsplash.com/photo-1617704548623-340376564e68?auto=format&fit=crop&q=80&w=2970",
      "https://images.unsplash.com/photo-1617704548623-340376564e68?auto=format&fit=crop&q=80&w=2970"
    ],
    chevrolet: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=2940",
      "https://images.unsplash.com/photo-1603577624238-52222ac211ce?auto=format&fit=crop&q=80&w=2940",
      "https://images.unsplash.com/photo-1578079445540-d83a4d114de9?auto=format&fit=crop&q=80&w=2787"
    ],
    nissan: [
      "https://images.unsplash.com/photo-1591552805381-36db00b3f99c?auto=format&fit=crop&q=80&w=2868",
      "https://images.unsplash.com/photo-1609561431099-41fb2dd0a5c4?auto=format&fit=crop&q=80&w=2787",
      "https://images.unsplash.com/photo-1622194993799-3120c8a8c0cd?auto=format&fit=crop&q=80&w=2874"
    ],
  },

  // Default images if no type or brand match
  default: {
    default: [
      "https://images.unsplash.com/photo-1567808291548-fc3ee04dbcf0?auto=format&fit=crop&q=80&w=2787",
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=2940",
      "https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&q=80&w=2940",
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=2940",
      "https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&q=80&w=2940"
    ]
  }
};

// Function to select the best image based on car details
const getCarImage = (car: Car): string => {
  // Default to a known image with decent quality
  if (car.images && car.images.length > 0) {
    return car.images[0];
  }

  // Try to find a brand match
  const brand = car.make.toLowerCase();
  const brandsToCheck = ['toyota', 'honda', 'ford', 'bmw', 'mercedes', 'audi', 'tesla', 'chevrolet', 'nissan'];

  let brandMatch = null;
  for (const brandToCheck of brandsToCheck) {
    if (brand.includes(brandToCheck)) {
      brandMatch = brandToCheck;
      break;
    }
  }

  if (brandMatch && carImageMap.brand[brandMatch]) {
    const brandImages = carImageMap.brand[brandMatch];
    return brandImages[Math.floor(Math.random() * brandImages.length)];
  }

  // If no brand match, try to match car type from features or description
  const typePatterns = [
    { keyword: 'suv', type: 'suv' },
    { keyword: 'crossover', type: 'suv' },
    { keyword: 'truck', type: 'truck' },
    { keyword: 'pickup', type: 'truck' },
    { keyword: 'sedan', type: 'sedan' },
    { keyword: 'coupe', type: 'coupe' },
    { keyword: 'convertible', type: 'convertible' },
    { keyword: 'sports', type: 'sports' },
    { keyword: 'sports car', type: 'sports' },
    { keyword: 'minivan', type: 'minivan' },
    { keyword: 'van', type: 'minivan' },
    { keyword: 'hatchback', type: 'hatchback' },
    { keyword: 'electric', type: 'electric' },
    { keyword: 'hybrid', type: 'hybrid' },
    { keyword: 'luxury', type: 'luxury' }
  ];

  // Check features for type matches
  let typeMatch = null;
  if (car.features) {
    for (const feature of car.features) {
      const pattern = typePatterns.find(p => feature.toLowerCase().includes(p.keyword));
      if (pattern) {
        typeMatch = pattern.type;
        break;
      }
    }
  }

  // Check description for type matches if we didn't find in features
  if (!typeMatch && car.description) {
    for (const pattern of typePatterns) {
      if (car.description.toLowerCase().includes(pattern.keyword)) {
        typeMatch = pattern.type;
        break;
      }
    }
  }

  // Check if the model name contains type indicators
  if (!typeMatch) {
    const modelLower = car.model.toLowerCase();
    for (const pattern of typePatterns) {
      if (modelLower.includes(pattern.keyword)) {
        typeMatch = pattern.type;
        break;
      }
    }
  }

  // Check fuel type for electric/hybrid matches
  if (!typeMatch) {
    if (car.fuel === 'electric') {
      typeMatch = 'electric';
    } else if (car.fuel === 'hybrid' || car.fuel === 'plug_in_hybrid') {
      typeMatch = 'hybrid';
    }
  }

  // If we found a type match, use it
  if (typeMatch && carImageMap.type[typeMatch]) {
    const typeImages = carImageMap.type[typeMatch];
    return typeImages[Math.floor(Math.random() * typeImages.length)];
  }

  // If all else fails, use a random default image
  const defaultImages = carImageMap.default.default;
  return defaultImages[Math.floor(Math.random() * defaultImages.length)];
};

interface CarCardProps {
  car: Car;
  isFavorited?: boolean;
  reviewCount?: number;
  averageRating?: number;
  showAllFeatures?: boolean;
}

const calculatePriceScore = (car: Car): number => {
  // Replace this with your actual price score calculation logic
  // This is a placeholder example
  const averagePrice = 30000; // Replace with actual average price for similar cars
  const priceDifference = car.price - averagePrice;
  const score = Math.max(
    0,
    100 - Math.abs(priceDifference / averagePrice) * 100,
  );
  return score;
};

export function CarCard({
  car,
  isFavorited = false,
  reviewCount = 0,
  averageRating = 0,
  showAllFeatures = false
}: CarCardProps) {
  const [isFavorite, setIsFavorite] = useState(isFavorited);
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to detail page

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save cars to favorites",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isFavorite) {
        // Remove from favorites
        await apiRequest("DELETE", `/api/favorites/${car.id}`);
        setIsFavorite(false);
        toast({
          title: "Removed from favorites",
          description: `${car.make} ${car.model} was removed from your favorites`
        });
      } else {
        // Add to favorites
        await apiRequest("POST", "/api/favorites", { carId: car.id });
        setIsFavorite(true);
        toast({
          title: "Added to favorites",
          description: `${car.make} ${car.model} was added to your favorites`
        });
      }

      // Invalidate favorites query to refetch favorites
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get appropriate image
  const imageUrl = getCarImage(car);

  // Format condition for display
  const formattedCondition = car.condition.replace('_', ' ');

  // Determine features to display
  const displayFeatures = showAllFeatures
    ? car.features || []
    : (car.features || []).slice(0, 3);

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <Link href={`/cars/${car.id}`}>
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover transition-transform hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-4 right-4">
            <Button
              variant="secondary"
              size="icon"
              className="bg-white hover:bg-white rounded-full shadow-md"
              onClick={handleFavoriteToggle}
              disabled={isLoading}
            >
              {isFavorite ? (
                <HeartFilled className="h-5 w-5 text-red-500" />
              ) : (
                <Heart className="h-5 w-5 text-gray-400" />
              )}
            </Button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
            <h3 className="text-white font-bold truncate">{car.title || `${car.year} ${car.make} ${car.model}`}</h3>
            <p className="text-white/90 text-sm">
              {car.year} • {car.mileage.toLocaleString()} miles
            </p>
          </div>
        </div>
      </Link>

      <CardContent className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">{formatPrice(car.price)}</span>
            <Badge
              variant="outline"
              className={`w-16 h-16 flex items-center justify-center rounded-lg text-lg ${
                calculatePriceScore(car) >= 70
                  ? "bg-green-100 text-green-800"
                  : calculatePriceScore(car) >= 40
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {Math.round(calculatePriceScore(car))}
            </Badge>
          </div>
          {averageRating > 0 && (
            <Rating
              value={averageRating}
              showValue={true}
              reviewCount={reviewCount}
              size="sm"
            />
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          <Badge variant="secondary" className="bg-primary/10 text-primary-700 font-medium">
            {formattedCondition}
          </Badge>
          <Badge variant="secondary" className="bg-primary/10 text-primary-700 font-medium capitalize">
            {car.fuel.replace('_', ' ')}
          </Badge>
          <Badge variant="secondary" className="bg-primary/10 text-primary-700 font-medium capitalize">
            {car.transmission}
          </Badge>
        </div>

        {displayFeatures.length > 0 && (
          <div className="space-y-1.5 mt-auto mb-4">
            {displayFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-1.5">
                <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center mt-auto gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={(e) => {
              e.preventDefault();
              if (user) {
                // Use mailto link instead of chat
                window.location.href = `mailto:seller-${car.userId}@autohaven.com?subject=Inquiry about ${car.year} ${car.make} ${car.model}&body=Hello,%0D%0A%0D%0AI am interested in your ${car.year} ${car.make} ${car.model} listed on AutoHaven.%0D%0A%0D%0APlease let me know more details about this vehicle.%0D%0A%0D%0AThank you,%0D%0A${user.username}`;
              } else {
                toast({
                  title: "Authentication required",
                  description: "Please log in to contact sellers",
                  variant: "destructive"
                });
              }
            }}
          >
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Button>
          <Link href={`/cars/${car.id}`}>
            <Button className="flex-1">
              <DirectionsCar className="mr-2 h-4 w-4" />
              Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton loader for car cards
export function CarCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        <Skeleton className="w-full h-full" />
      </div>

      <CardContent className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>

        <div className="flex gap-1.5 mb-4">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>

        <div className="space-y-2 mt-auto mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>

        <div className="flex gap-2 mt-auto">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </CardContent>
    </Card>
  );
}