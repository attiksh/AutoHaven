import React from "react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { Search } from "@/components/ui/icons";

export default function Hero() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchTerm.trim()) {
      window.location.href = `/cars?keyword=${encodeURIComponent(searchTerm)}`;
    } else {
      toast({
        title: "Search term required",
        description: "Please enter a make, model, or keyword to search",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="relative h-[600px] lg:h-[700px] overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=700&q=80" 
          alt="Modern cars on display" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 to-gray-900/90"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative h-full">
        <div className="flex flex-col justify-center h-full max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Find Your Perfect Drive
          </h1>
          <p className="text-lg md:text-xl text-gray-100 mb-8">
            Join thousands of satisfied customers who found their dream cars on AutoHaven.
          </p>
          
          {/* Quick Search */}
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Find Your Dream Car</h3>
            <form onSubmit={handleSearch}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                    Search by Make, Model or Keywords
                  </Label>
                  <div className="relative">
                    <Input 
                      type="text" 
                      id="search" 
                      placeholder="e.g., Tesla Model 3, Toyota Hybrid..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3"
                    />
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                  </div>
                </div>
                <Button 
                  type="submit"
                  className="w-full"
                >
                  Search Cars
                </Button>
                <div className="flex justify-center">
                  <Link href="/cars" className="text-primary hover:underline text-sm">
                    Advanced Search
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
