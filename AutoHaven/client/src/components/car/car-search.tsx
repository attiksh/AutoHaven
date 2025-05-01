import React from "react";
import { useState, useEffect } from 'react';
import { useLocation, useSearch } from 'wouter';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Search } from '@/components/ui/icons';
import { Checkbox } from '@/components/ui/checkbox';
import { useQuery } from '@tanstack/react-query';
import { Car } from '@shared/schema';

// Car makes data
const carMakes = [
  "All Makes", 
  "Acura", "Audi", "BMW", "Chevrolet", "Dodge", "Ford", "GMC", "Honda", 
  "Hyundai", "Jeep", "Kia", "Lexus", "Mazda", "Mercedes-Benz", "Nissan", 
  "Subaru", "Tesla", "Toyota", "Volkswagen", "Volvo"
];

// Car conditions
const carConditions = [
  "All Conditions", "New", "Like New", "Excellent", "Good", "Fair", "Poor"
];

// Fuel types
const fuelTypes = [
  "All Fuel Types", "Gasoline", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid", "Other"
];

// Transmission types
const transmissionTypes = [
  "All Transmissions", "Automatic", "Manual", "Semi-automatic"
];

// Year ranges
const yearRanges = [
  "All Years", "2023+", "2020-2022", "2015-2019", "2010-2014", "2000-2009", "Before 2000"
];

export function CarSearch() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  
  // State for form fields
  const [make, setMake] = useState<string>(searchParams.get('make') || '');
  const [model, setModel] = useState<string>(searchParams.get('model') || '');
  const [minPrice, setMinPrice] = useState<number>(parseInt(searchParams.get('minPrice') || '0'));
  const [maxPrice, setMaxPrice] = useState<number>(parseInt(searchParams.get('maxPrice') || '100000'));
  const [condition, setCondition] = useState<string>(searchParams.get('condition')?.toLowerCase() || '');
  const [fuel, setFuel] = useState<string>(searchParams.get('fuel')?.toLowerCase() || '');
  const [transmission, setTransmission] = useState<string>(searchParams.get('transmission')?.toLowerCase() || '');
  const [yearRange, setYearRange] = useState<string>(searchParams.get('yearRange') || '');
  const [minMileage, setMinMileage] = useState<number>(parseInt(searchParams.get('minMileage') || '0'));
  const [maxMileage, setMaxMileage] = useState<number>(parseInt(searchParams.get('maxMileage') || '200000'));
  const [features, setFeatures] = useState<string[]>(
    searchParams.get('features') ? searchParams.get('features')!.split(',') : []
  );
  
  // Fetch available models based on selected make
  const { data: cars } = useQuery<Car[]>({
    queryKey: ['/api/cars'],
    queryFn: async () => {
      const response = await fetch('/api/cars');
      if (!response.ok) throw new Error('Failed to fetch cars');
      return response.json();
    },
  });
  
  // Extract all unique models for the selected make
  const availableModels = cars 
    ? Array.from(new Set(cars
        .filter(car => !make || make === 'All Makes' || car.make === make)
        .map(car => car.model)))
        .sort()
    : [];
  
  // Extract all unique features from cars for feature filtering
  const allFeatures = cars 
    ? Array.from(new Set(cars.flatMap(car => car.features || [])
        .filter(feature => !!feature)))
        .sort()
    : [];
  
  // Advanced search state
  const [showAdvanced, setShowAdvanced] = useState<boolean>(
    !!condition || !!fuel || !!transmission || !!yearRange || 
    minMileage > 0 || maxMileage < 200000 || features.length > 0
  );
  
  // Handle price range change
  const handlePriceChange = (value: number[]) => {
    setMinPrice(value[0]);
    setMaxPrice(value[1]);
  };
  
  // Handle mileage range change
  const handleMileageChange = (value: number[]) => {
    setMinMileage(value[0]);
    setMaxMileage(value[1]);
  };
  
  // Handle feature toggle
  const handleFeatureToggle = (feature: string) => {
    if (features.includes(feature)) {
      setFeatures(features.filter(f => f !== feature));
    } else {
      setFeatures([...features, feature]);
    }
  };
  
  // Parse year range to min and max year
  const parseYearRange = (range: string): { minYear?: number, maxYear?: number } => {
    if (!range || range === 'All Years') return {};
    
    if (range === '2023+') return { minYear: 2023 };
    if (range === '2020-2022') return { minYear: 2020, maxYear: 2022 };
    if (range === '2015-2019') return { minYear: 2015, maxYear: 2019 };
    if (range === '2010-2014') return { minYear: 2010, maxYear: 2014 };
    if (range === '2000-2009') return { minYear: 2000, maxYear: 2009 };
    if (range === 'Before 2000') return { maxYear: 1999 };
    
    return {};
  };
  
  // Submit the search form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    
    if (make && make !== 'All Makes') params.set('make', make);
    if (model) params.set('model', model);
    if (minPrice > 0) params.set('minPrice', minPrice.toString());
    if (maxPrice < 100000) params.set('maxPrice', maxPrice.toString());
    
    // Advanced filters
    if (condition && condition !== 'all conditions') {
      params.set('condition', condition.toLowerCase());
    }
    if (fuel && fuel !== 'all fuel types') {
      params.set('fuel', fuel.toLowerCase());
    }
    if (transmission && transmission !== 'all transmissions') {
      params.set('transmission', transmission.toLowerCase());
    }
    
    // Year range
    if (yearRange && yearRange !== 'All Years') {
      const { minYear, maxYear } = parseYearRange(yearRange);
      if (minYear) params.set('minYear', minYear.toString());
      if (maxYear) params.set('maxYear', maxYear.toString());
    }
    
    // Mileage range
    if (minMileage > 0) params.set('minMileage', minMileage.toString());
    if (maxMileage < 200000) params.set('maxMileage', maxMileage.toString());
    
    // Features
    if (features.length > 0) {
      params.set('features', features.join(','));
    }
    
    navigate(`/cars?${params.toString()}`);
  };
  
  // Reset form to initial state
  const handleReset = () => {
    setMake('');
    setModel('');
    setMinPrice(0);
    setMaxPrice(100000);
    setCondition('');
    setFuel('');
    setTransmission('');
    setYearRange('');
    setMinMileage(0);
    setMaxMileage(200000);
    setFeatures([]);
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <CardTitle className="text-2xl">Find Your Perfect Car</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <Label htmlFor="make" className="mb-1.5 block">Make</Label>
              <Select value={make} onValueChange={(value) => {
                setMake(value);
                setModel(''); // Reset model when make changes
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select make" />
                </SelectTrigger>
                <SelectContent>
                  {carMakes.map(make => (
                    <SelectItem key={make} value={make}>
                      {make}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="model" className="mb-1.5 block">Model</Label>
              {availableModels.length > 0 ? (
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Models">Any Model</SelectItem>
                    {availableModels.map(model => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input 
                  id="model" 
                  placeholder="Enter model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                />
              )}
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <Label className="mb-1.5 block">Price Range</Label>
              <div className="pt-5 px-3">
                <Slider
                  defaultValue={[minPrice, maxPrice]}
                  min={0}
                  max={100000}
                  step={1000}
                  value={[minPrice, maxPrice]}
                  onValueChange={handlePriceChange}
                  className="h-2"
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>${minPrice.toLocaleString()}</span>
                <span>${maxPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <Accordion 
            type="single" 
            collapsible
            value={showAdvanced ? "advanced" : ""}
            onValueChange={(val) => setShowAdvanced(val === "advanced")}
          >
            <AccordionItem value="advanced" className="border px-4 rounded-lg shadow-sm">
              <AccordionTrigger className="text-sm font-medium py-3">
                Advanced Search Options
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="condition" className="mb-1.5 block">Condition</Label>
                      <Select value={condition} onValueChange={setCondition}>
                        <SelectTrigger>
                          <SelectValue placeholder="Any condition" />
                        </SelectTrigger>
                        <SelectContent>
                          {carConditions.map(condition => (
                            <SelectItem key={condition} value={condition.toLowerCase()}>
                              {condition}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="fuel" className="mb-1.5 block">Fuel Type</Label>
                      <Select value={fuel} onValueChange={setFuel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Any fuel type" />
                        </SelectTrigger>
                        <SelectContent>
                          {fuelTypes.map(fuel => (
                            <SelectItem key={fuel} value={fuel.toLowerCase()}>
                              {fuel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="transmission" className="mb-1.5 block">Transmission</Label>
                      <Select value={transmission} onValueChange={setTransmission}>
                        <SelectTrigger>
                          <SelectValue placeholder="Any transmission" />
                        </SelectTrigger>
                        <SelectContent>
                          {transmissionTypes.map(transmission => (
                            <SelectItem key={transmission} value={transmission.toLowerCase()}>
                              {transmission}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="yearRange" className="mb-1.5 block">Year Range</Label>
                      <Select value={yearRange} onValueChange={setYearRange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Any year" />
                        </SelectTrigger>
                        <SelectContent>
                          {yearRanges.map(range => (
                            <SelectItem key={range} value={range}>
                              {range}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="mb-1.5 block">Mileage Range</Label>
                      <div className="pt-4 px-3">
                        <Slider
                          defaultValue={[minMileage, maxMileage]}
                          min={0}
                          max={200000}
                          step={5000}
                          value={[minMileage, maxMileage]}
                          onValueChange={handleMileageChange}
                          className="h-2"
                        />
                      </div>
                      <div className="flex justify-between mt-2 text-sm text-gray-500">
                        <span>{minMileage.toLocaleString()} miles</span>
                        <span>{maxMileage.toLocaleString()} miles</span>
                      </div>
                    </div>
                  </div>
                  
                  {allFeatures.length > 0 && (
                    <div>
                      <Label className="mb-2 block">Features</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {allFeatures.slice(0, 9).map(feature => (
                          <div key={feature} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`feature-${feature}`} 
                              checked={features.includes(feature)}
                              onCheckedChange={() => handleFeatureToggle(feature)}
                            />
                            <label
                              htmlFor={`feature-${feature}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {feature}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="flex justify-between mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleReset}
            >
              Reset Filters
            </Button>
            
            <Button type="submit" className="flex items-center gap-2 bg-primary hover:bg-primary/90">
              <Search className="h-4 w-4" />
              Search Cars
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
