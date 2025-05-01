import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation } from 'wouter';
import { insertCarSchema, Car } from '@shared/schema';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from 'lucide-react';

// Extend the car schema for the form with validation
const carFormSchema = insertCarSchema
  .omit({ userId: true })  // Remove userId since it's set by the server
  .extend({
    year: z.number().min(1900).max(new Date().getFullYear() + 1),
    price: z.number().min(100).max(10000000),
    mileage: z.number().min(0).max(1000000),
    features: z.string().transform(str => str.split(',').map(s => s.trim()).filter(Boolean)),
    images: z.string().transform(str => str.split(',').map(s => s.trim()).filter(Boolean)),
  });

type CarFormValues = z.infer<typeof carFormSchema>;

// The condition options
const conditionOptions = [
  { value: "new", label: "New" },
  { value: "like_new", label: "Like New" },
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
];

// The fuel type options
const fuelOptions = [
  { value: "gasoline", label: "Gasoline" },
  { value: "diesel", label: "Diesel" },
  { value: "electric", label: "Electric" },
  { value: "hybrid", label: "Hybrid" },
  { value: "plug_in_hybrid", label: "Plug-in Hybrid" },
  { value: "other", label: "Other" },
];

// The transmission options
const transmissionOptions = [
  { value: "automatic", label: "Automatic" },
  { value: "manual", label: "Manual" },
  { value: "semi_automatic", label: "Semi-Automatic" },
];

interface CarFormProps {
  car?: Car;  // For editing an existing car
}

export function CarForm({ car }: CarFormProps = {}) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize the form with default values or existing car data
  const form = useForm<CarFormValues>({
    resolver: zodResolver(carFormSchema),
    defaultValues: car ? {
      ...car,
      features: car.features?.join(', ') || '',
      images: car.images?.join(', ') || '',
    } : {
      title: '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      condition: 'good',
      fuel: 'gasoline',
      transmission: 'automatic',
      description: '',
      features: '',
      location: '',
      images: '',
    },
  });
  
  // Handle form submission
  const onSubmit = async (values: CarFormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a listing",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (car) {
        // Update existing car
        await apiRequest("PUT", `/api/cars/${car.id}`, values);
        toast({
          title: "Car listing updated",
          description: "Your listing has been updated successfully",
        });
      } else {
        // Create new car
        const result = await apiRequest("POST", `/api/cars`, values);
        const newCar = await result.json();
        toast({
          title: "Car listing created",
          description: "Your car has been listed successfully",
        });
        // Navigate to the new car listing
        navigate(`/cars/${newCar.id}`);
      }
      
      // Invalidate cars query to refetch cars
      queryClient.invalidateQueries({ queryKey: ['/api/cars'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your car listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{car ? "Edit Listing" : "Create New Listing"}</CardTitle>
        <CardDescription>
          {car 
            ? "Update the details of your car listing below" 
            : "Fill out the form below to list your car for sale"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Listing Title</FormLabel>
                    <FormControl>
                      <Input placeholder="2022 Toyota Camry XSE V6" {...field} />
                    </FormControl>
                    <FormDescription>
                      Create a catchy title for your listing
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City, State" {...field} />
                    </FormControl>
                    <FormDescription>
                      Where is the car located?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="make"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Make</FormLabel>
                    <FormControl>
                      <Input placeholder="Toyota" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="Camry" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mileage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mileage</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {conditionOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fuel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fuel Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select fuel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fuelOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transmission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transmission</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select transmission" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {transmissionOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your car, its history, and any special features" 
                      rows={5}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Features</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Leather Seats, Navigation, Backup Camera" 
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      List features separated by commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Image URL 1, Image URL 2, Image URL 3" 
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Enter image URLs separated by commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full md:w-auto" 
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {car ? "Update Listing" : "Create Listing"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
