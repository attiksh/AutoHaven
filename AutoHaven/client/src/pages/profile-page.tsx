import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User, Car } from "@shared/schema";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { CarList } from "@/components/car/car-list";
import { CarForm } from "@/components/car/car-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreatingCar, setIsCreatingCar] = useState(false);
  const [deleteCarId, setDeleteCarId] = useState<number | null>(null);
  
  // State for profile form
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    avatar: user?.avatar || "",
    bio: user?.bio || "",
  });
  
  // Fetch user's cars
  const { data: userCars, isLoading: carsLoading } = useQuery<Car[]>({
    queryKey: ["/api/users", user?.id, "cars"],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      const response = await fetch(`/api/users/${user.id}/cars`);
      if (!response.ok) throw new Error("Failed to fetch cars");
      return response.json();
    },
  });
  
  // Fetch user's favorites
  const { data: favorites, isLoading: favoritesLoading } = useQuery({
    queryKey: ["/api/favorites"],
    enabled: !!user,
  });
  
  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: Partial<User>) => {
      if (!user) throw new Error("User not authenticated");
      const response = await apiRequest("PUT", `/api/users/${user.id}`, profileData);
      return response.json();
    },
    onSuccess: (updatedUser) => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      
      // Update the user data in the auth context
      queryClient.setQueryData(["/api/user"], updatedUser);
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete car mutation
  const deleteCarMutation = useMutation({
    mutationFn: async (carId: number) => {
      await apiRequest("DELETE", `/api/cars/${carId}`);
    },
    onSuccess: () => {
      toast({
        title: "Car deleted",
        description: "The car listing has been removed successfully",
      });
      
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "cars"] });
      setDeleteCarId(null);
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle profile form change
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle profile form submit
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileForm);
  };
  
  // Handle car deletion
  const handleDeleteCar = (carId: number) => {
    setDeleteCarId(carId);
  };
  
  // Confirm car deletion
  const confirmDeleteCar = () => {
    if (deleteCarId) {
      deleteCarMutation.mutate(deleteCarId);
    }
  };
  
  if (!user) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p className="text-gray-500 mb-4">Please log in to access your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500">Manage your account, listings, and favorites</p>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="listings">My Listings</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit}>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={user.username}
                      disabled
                      className="bg-gray-100"
                    />
                    <p className="text-sm text-gray-500">
                      Your username cannot be changed
                    </p>
                  </div>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={profileForm.name}
                      onChange={handleProfileChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={user.email}
                      disabled
                      className="bg-gray-100"
                    />
                    <p className="text-sm text-gray-500">
                      Email cannot be changed
                    </p>
                  </div>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="avatar">Profile Picture URL</Label>
                    <Input
                      id="avatar"
                      name="avatar"
                      value={profileForm.avatar}
                      onChange={handleProfileChange}
                      placeholder="https://example.com/your-image.jpg"
                    />
                  </div>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={profileForm.bio}
                      onChange={handleProfileChange}
                      placeholder="Tell others about yourself"
                      rows={4}
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Listings Tab */}
        <TabsContent value="listings">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">My Car Listings</h2>
            <Dialog open={isCreatingCar} onOpenChange={setIsCreatingCar}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Listing
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Create New Car Listing</DialogTitle>
                  <DialogDescription>
                    Fill out the details to list your car for sale
                  </DialogDescription>
                </DialogHeader>
                <CarForm />
              </DialogContent>
            </Dialog>
          </div>
          
          {carsLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !userCars || userCars.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-primary-50 p-3 mb-4">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Listings Yet</h3>
                <p className="text-gray-500 text-center mb-6 max-w-md">
                  You haven't created any car listings yet. Create your first listing to start selling.
                </p>
                <Button onClick={() => setIsCreatingCar(true)}>
                  Create Your First Listing
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {userCars.map((car) => (
                <Card key={car.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/4 h-48 md:h-auto">
                      <img
                        src={car.images && car.images.length > 0 ? car.images[0] : "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=350&q=80"}
                        alt={car.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex justify-between mb-2">
                        <h3 className="text-xl font-semibold">{car.title}</h3>
                        <span className="font-bold text-primary-800">
                          ${car.price.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-500 mb-4">
                        {car.year} • {car.mileage.toLocaleString()} miles • {car.fuel}
                      </p>
                      <p className="text-gray-700 line-clamp-2 mb-4">
                        {car.description}
                      </p>
                      <div className="flex justify-end space-x-3">
                        <Button variant="outline" size="sm">
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteCar(car.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete your listing for the {car.year} {car.make} {car.model}.
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={confirmDeleteCar}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                {deleteCarMutation.isPending && (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Favorites Tab */}
        <TabsContent value="favorites">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Saved Favorites</h2>
          
          {favoritesLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !favorites || favorites.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-primary-50 p-3 mb-4">
                  <Loader2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Favorites Yet</h3>
                <p className="text-gray-500 text-center mb-6 max-w-md">
                  You haven't saved any cars to your favorites yet. Browse listings and click the heart icon to save cars you're interested in.
                </p>
                <Button onClick={() => window.location.href = "/cars"}>
                  Browse Cars
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((favorite) => (
                <div key={favorite.car.id}>
                  {/* Use the existing CarCard component to display each favorite */}
                  {/* This is a placeholder, actual implementation would use CarCard */}
                  <Card className="overflow-hidden">
                    <div className="h-48 relative">
                      <img
                        src={favorite.car.images && favorite.car.images.length > 0 ? favorite.car.images[0] : "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=350&q=80"}
                        alt={favorite.car.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-semibold">{favorite.car.make} {favorite.car.model}</h3>
                        <span className="font-bold text-primary-800">
                          ${favorite.car.price.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {favorite.car.year} • {favorite.car.mileage.toLocaleString()} miles
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
