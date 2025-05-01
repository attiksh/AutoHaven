import React from 'react';
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Car } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Loader2, Heart, MessageCircle, HeartOff, Check, AlertTriangle } from "lucide-react";
import { Heart as HeartIcon, HeartFilled } from "@/components/ui/icons";

export default function CarDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [messageContent, setMessageContent] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  // Fetch car details
  const { data: car, isLoading, error } = useQuery<Car>({
    queryKey: [`/api/cars/${id}`],
  });

  // Check if car is favorited
  const { data: favorites } = useQuery({
    queryKey: ["/api/favorites"],
    enabled: !!user,
  });

  // Mutation for sending message
  const messageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user || !car) return;
      
      const messageData = {
        receiverId: car.userId,
        carId: car.id,
        content,
      };
      
      const response = await apiRequest("POST", "/api/messages", messageData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent",
        description: "Your message has been sent to the seller",
      });
      setMessageContent("");
    },
    onError: (error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation for toggling favorite status
  const favoriteMutation = useMutation({
    mutationFn: async () => {
      if (!user || !car) return;
      
      if (isFavorite) {
        await apiRequest("DELETE", `/api/favorites/${car.id}`);
      } else {
        await apiRequest("POST", "/api/favorites", { carId: car.id });
      }
    },
    onSuccess: () => {
      setIsFavorite(!isFavorite);
      toast({
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        description: isFavorite 
          ? "Car has been removed from your favorites" 
          : "Car has been added to your favorites",
      });
      
      // Invalidate favorites query
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
    },
    onError: (error) => {
      toast({
        title: "Action failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle sending message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageContent.trim()) return;
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to send messages",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    messageMutation.mutate(messageContent);
  };

  // Handle favorite toggle
  const handleFavoriteToggle = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to save favorites",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    favoriteMutation.mutate();
  };

  // Format price with commas
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (error || !car) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Error Loading Car
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Sorry, we couldn't load the car details. Please try again later.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/cars")}>Back to Listings</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Default image if none provided
  const carImages = car.images && car.images.length > 0
    ? car.images
    : ["https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=600&q=80"];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Car images and details */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <Carousel className="w-full">
              <CarouselContent>
                {carImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-64 md:h-96 rounded-xl overflow-hidden">
                      <img 
                        src={image} 
                        alt={`${car.make} ${car.model} - View ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{car.title}</h1>
              <div className="mt-2 md:mt-0">
                <span className="text-2xl font-bold text-primary">{formatPrice(car.price)}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="outline" className="bg-gray-100">
                {car.year}
              </Badge>
              <Badge variant="outline" className="bg-gray-100">
                {car.mileage.toLocaleString()} miles
              </Badge>
              <Badge variant="outline" className="bg-gray-100 capitalize">
                {car.fuel.replace("_", " ")}
              </Badge>
              <Badge variant="outline" className="bg-gray-100 capitalize">
                {car.transmission.replace("_", " ")}
              </Badge>
              <Badge variant="outline" className="bg-gray-100 capitalize">
                {car.condition.replace("_", " ")}
              </Badge>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Make</span>
                        <span className="font-medium">{car.make}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Model</span>
                        <span className="font-medium">{car.model}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Year</span>
                        <span className="font-medium">{car.year}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Mileage</span>
                        <span className="font-medium">{car.mileage.toLocaleString()} miles</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Fuel Type</span>
                        <span className="font-medium capitalize">{car.fuel.replace("_", " ")}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Transmission</span>
                        <span className="font-medium capitalize">{car.transmission.replace("_", " ")}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Condition</span>
                        <span className="font-medium capitalize">{car.condition.replace("_", " ")}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Location</span>
                        <span className="font-medium">{car.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-gray-700 whitespace-pre-line">{car.description}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="features" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Features & Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  {car.features && car.features.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {car.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No features listed for this vehicle.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <Rating value={4.7} size="lg" showValue={true} reviewCount={24} />
                  </div>
                  
                  <div className="space-y-6">
                    {/* Placeholder reviews for now */}
                    <div className="border-b pb-4">
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                        <div>
                          <h4 className="font-medium">Michael S.</h4>
                          <Rating value={5} size="sm" />
                        </div>
                      </div>
                      <p className="mt-2 text-gray-700">
                        Great car! The description was accurate and the seller was very helpful.
                        Would definitely recommend.
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                        <div>
                          <h4 className="font-medium">Sarah J.</h4>
                          <Rating value={4.5} size="sm" />
                        </div>
                      </div>
                      <p className="mt-2 text-gray-700">
                        The car was in excellent condition as described. The seller was responsive and
                        made the purchase process smooth.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Contact seller section */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Contact Seller</CardTitle>
              <CardDescription>
                Have questions about this {car.make} {car.model}?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button className="w-full">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Send Message
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Message the Seller</SheetTitle>
                      <SheetDescription>
                        Ask about the {car.year} {car.make} {car.model}
                      </SheetDescription>
                    </SheetHeader>
                    <div className="py-6">
                      <form onSubmit={handleSendMessage}>
                        <Textarea
                          className="min-h-[150px] mb-4"
                          placeholder="Type your message here..."
                          value={messageContent}
                          onChange={(e) => setMessageContent(e.target.value)}
                        />
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={messageMutation.isPending || !messageContent.trim()}
                        >
                          {messageMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Send Message
                        </Button>
                      </form>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={handleFavoriteToggle}
                disabled={favoriteMutation.isPending}
              >
                {favoriteMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : isFavorite ? (
                  <>
                    <HeartFilled className="h-5 w-5 mr-2 text-red-500" />
                    Remove from Favorites
                  </>
                ) : (
                  <>
                    <HeartIcon className="h-5 w-5 mr-2" />
                    Save to Favorites
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
