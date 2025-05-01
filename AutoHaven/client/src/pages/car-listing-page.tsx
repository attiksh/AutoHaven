import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CarList } from "@/components/car/car-list";
import { CarSearch } from "@/components/car/car-search";
import { useLocation, useSearch } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Filter, SlidersHorizontal, X, MessageCircle, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { Car } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export default function CarListingPage() {
  const search = useSearch();
  const [messageContent, setMessageContent] = useState("");
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const searchParams = new URLSearchParams(search);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("newest");
  const ITEMS_PER_PAGE = 9;

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
  
  // Fetch all cars to get total count
  const { data: cars } = useQuery<Car[]>({
    queryKey: ['/api/cars'],
    queryFn: async () => {
      const response = await fetch('/api/cars');
      if (!response.ok) throw new Error('Failed to fetch cars');
      return response.json();
    },
  });
  
  // Calculate total number of pages
  const totalItems = cars?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  // Parse current filters from URL
  const currentFilters = Object.fromEntries(searchParams.entries());
  
  // Add pagination to filters
  const paginatedFilters = {
    ...currentFilters,
    page: currentPage.toString(),
    perPage: ITEMS_PER_PAGE.toString(),
    sort: sortOption
  };

  // Generate a readable summary of applied filters
  const getFilterSummary = () => {
    const summary = [];
    
    if (currentFilters.make && currentFilters.make !== 'All Makes') {
      summary.push(currentFilters.make);
    }
    if (currentFilters.model && currentFilters.model !== 'All Models') {
      summary.push(currentFilters.model);
    }
    if (currentFilters.minPrice || currentFilters.maxPrice) {
      const minPrice = currentFilters.minPrice ? `$${parseInt(currentFilters.minPrice).toLocaleString()}` : "$0";
      const maxPrice = currentFilters.maxPrice ? `$${parseInt(currentFilters.maxPrice).toLocaleString()}` : "Any";
      summary.push(`${minPrice} - ${maxPrice}`);
    }
    
    // Year range
    if (currentFilters.minYear && currentFilters.maxYear) {
      summary.push(`${currentFilters.minYear} - ${currentFilters.maxYear}`);
    } else if (currentFilters.minYear) {
      summary.push(`${currentFilters.minYear}+`);
    } else if (currentFilters.maxYear) {
      summary.push(`Before ${currentFilters.maxYear}`);
    }
    
    // Other filters
    if (currentFilters.condition) summary.push(currentFilters.condition.replace('_', ' '));
    if (currentFilters.fuel) summary.push(currentFilters.fuel.replace('_', ' '));
    if (currentFilters.transmission) summary.push(currentFilters.transmission.replace('_', ' '));
    
    // Mileage
    if (currentFilters.minMileage || currentFilters.maxMileage) {
      const minMileage = currentFilters.minMileage ? `${parseInt(currentFilters.minMileage).toLocaleString()}` : "0";
      const maxMileage = currentFilters.maxMileage ? `${parseInt(currentFilters.maxMileage).toLocaleString()}` : "Any";
      summary.push(`${minMileage} - ${maxMileage} miles`);
    }
    
    // Features
    if (currentFilters.features) {
      const featureCount = currentFilters.features.split(',').length;
      if (featureCount === 1) {
        summary.push(currentFilters.features);
      } else {
        summary.push(`${featureCount} features`);
      }
    }
    
    return summary.length > 0 ? summary : ["All Cars"];
  };
  
  // Handle filter removal
  const removeFilter = (key: string) => {
    const newParams = new URLSearchParams(search);
    newParams.delete(key);
    navigate(`/cars?${newParams.toString()}`);
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        {/* Desktop filter */}
        <div className="hidden md:block">
          <CarSearch />
        </div>
        
        {/* Mobile filter button */}
        <div className="md:hidden">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full flex justify-between">
                <span className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </span>
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh]">
              <SheetHeader className="mb-4">
                <SheetTitle>Search Filters</SheetTitle>
                <SheetDescription>
                  Refine your search with the options below
                </SheetDescription>
              </SheetHeader>
              <CarSearch />
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Car listing section */}
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Available Cars
                {totalItems > 0 && <span className="text-gray-500 font-normal text-base ml-2">({totalItems} listings)</span>}
              </h1>
              
              {/* Active filters */}
              <div className="flex flex-wrap gap-2 mt-3 mb-4">
                {getFilterSummary().map((filter, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1 flex items-center gap-1">
                    {filter}
                    {Object.keys(currentFilters).length > 0 && (
                      <button 
                        onClick={() => removeFilter(Object.keys(currentFilters)[index])}
                        className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
                
                {Object.keys(currentFilters).length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="px-2 h-7 text-sm"
                    onClick={() => navigate('/cars')}
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </div>
            
            {/* Sort options */}
            <div className="mt-4 md:mt-0">
              <Select value={sortOption} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="mileage_low">Mileage: Low to High</SelectItem>
                  <SelectItem value="mileage_high">Mileage: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <CarList searchParams={paginatedFilters} />
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {Array.from({ length: totalPages }).map((_, index) => {
                  // Show limited page numbers with ellipsis for large page counts
                  if (
                    totalPages <= 7 ||
                    index === 0 ||
                    index === totalPages - 1 ||
                    Math.abs(index + 1 - currentPage) <= 1
                  ) {
                    return (
                      <Button
                        key={index}
                        variant={currentPage === index + 1 ? "default" : "outline"}
                        className={`w-10 h-10 ${currentPage === index + 1 ? 'text-white' : 'text-gray-700'}`}
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </Button>
                    );
                  } else if (
                    (index === 1 && currentPage > 3) ||
                    (index === totalPages - 2 && currentPage < totalPages - 2)
                  ) {
                    return (
                      <span key={index} className="px-2">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                {/* Contact seller section */}
                <div>
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
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
