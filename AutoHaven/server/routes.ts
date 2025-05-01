import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertCarSchema, insertMessageSchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  setupAuth(app);
  
  // Car routes
  app.get("/api/cars", async (req, res) => {
    try {
      // Extract query parameters for filtering
      const { 
        make, model, minPrice, maxPrice, condition, 
        fuel, transmission, minYear, maxYear,
        minMileage, maxMileage, features
      } = req.query;
      
      // Basic filters for direct equality checks
      let filters: Record<string, any> = {};
      
      // Add exact match filters
      if (make) filters.make = make;
      if (model) filters.model = model;
      if (condition) filters.condition = condition;
      if (fuel) filters.fuel = fuel;
      if (transmission) filters.transmission = transmission;
      
      // Get all cars with basic filters
      const cars = await storage.getCars(filters);
      
      // Apply numeric range filters (these can't be done with key-value equality)
      let filteredCars = cars;
      
      // Price range filtering
      if (minPrice) {
        filteredCars = filteredCars.filter(car => car.price >= Number(minPrice));
      }
      if (maxPrice) {
        filteredCars = filteredCars.filter(car => car.price <= Number(maxPrice));
      }
      
      // Year range filtering
      if (minYear) {
        filteredCars = filteredCars.filter(car => car.year >= Number(minYear));
      }
      if (maxYear) {
        filteredCars = filteredCars.filter(car => car.year <= Number(maxYear));
      }
      
      // Mileage range filtering
      if (minMileage) {
        filteredCars = filteredCars.filter(car => car.mileage >= Number(minMileage));
      }
      if (maxMileage) {
        filteredCars = filteredCars.filter(car => car.mileage <= Number(maxMileage));
      }
      
      // Features filtering (must have all selected features)
      if (features) {
        const featureList = String(features).split(',');
        filteredCars = filteredCars.filter(car => {
          if (!car.features || !Array.isArray(car.features)) return false;
          
          // Check if car has all selected features
          return featureList.every(feature => 
            car.features && car.features.includes(feature)
          );
        });
      }
      
      res.json(filteredCars);
    } catch (error) {
      console.error('Error fetching cars:', error);
      res.status(500).json({ error: "Failed to fetch cars" });
    }
  });
  
  app.get("/api/cars/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const car = await storage.getCar(id);
      
      if (!car) {
        return res.status(404).json({ error: "Car not found" });
      }
      
      res.json(car);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch car" });
    }
  });
  
  app.post("/api/cars", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    
    try {
      // Validate the request body
      const validatedData = insertCarSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const car = await storage.createCar(validatedData);
      res.status(201).json(car);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create car listing" });
    }
  });
  
  app.put("/api/cars/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    
    try {
      const id = parseInt(req.params.id);
      const car = await storage.getCar(id);
      
      if (!car) {
        return res.status(404).json({ error: "Car not found" });
      }
      
      // Check if the user owns this car
      if (car.userId !== req.user.id) {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      const updatedCar = await storage.updateCar(id, req.body);
      res.json(updatedCar);
    } catch (error) {
      res.status(500).json({ error: "Failed to update car listing" });
    }
  });
  
  app.delete("/api/cars/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    
    try {
      const id = parseInt(req.params.id);
      const car = await storage.getCar(id);
      
      if (!car) {
        return res.status(404).json({ error: "Car not found" });
      }
      
      // Check if the user owns this car
      if (car.userId !== req.user.id) {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      await storage.deleteCar(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete car listing" });
    }
  });
  
  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Don't return password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });
  
  app.get("/api/users/:id/cars", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const cars = await storage.getUserCars(id);
      res.json(cars);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user's cars" });
    }
  });
  
  // Message routes
  app.get("/api/messages", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    
    try {
      const messages = await storage.getUserMessages(req.user.id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });
  
  app.get("/api/messages/:userId/:carId", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    
    try {
      const currentUserId = req.user.id;
      const otherUserId = parseInt(req.params.userId);
      const carId = parseInt(req.params.carId);
      
      const messages = await storage.getMessagesBetweenUsers(currentUserId, otherUserId, carId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });
  
  app.post("/api/messages", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    
    try {
      // Validate the request body
      const validatedData = insertMessageSchema.parse({
        ...req.body,
        senderId: req.user.id
      });
      
      const message = await storage.createMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to send message" });
    }
  });
  
  app.put("/api/messages/:id/read", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    
    try {
      const id = parseInt(req.params.id);
      const message = await storage.getMessage(id);
      
      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }
      
      // Check if the user is the receiver
      if (message.receiverId !== req.user.id) {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      const updatedMessage = await storage.markMessageAsRead(id);
      res.json(updatedMessage);
    } catch (error) {
      res.status(500).json({ error: "Failed to mark message as read" });
    }
  });
  
  // Review routes
  app.get("/api/reviews", async (req, res) => {
    try {
      // Get reviews for all cars, organized by car ID
      const allReviews = [];
      
      // Get all cars
      const cars = await storage.getCars();
      
      // For each car, get reviews
      for (const car of cars) {
        const carReviews = await storage.getCarReviews(car.id);
        allReviews.push(...carReviews);
      }
      
      res.json(allReviews);
    } catch (error) {
      console.error('Error fetching all reviews:', error);
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });
  
  app.get("/api/cars/:id/reviews", async (req, res) => {
    try {
      const carId = parseInt(req.params.id);
      const reviews = await storage.getCarReviews(carId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });
  
  app.post("/api/reviews", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    
    try {
      // Validate the request body
      const validatedData = insertReviewSchema.parse({
        ...req.body,
        reviewerId: req.user.id
      });
      
      const review = await storage.createReview(validatedData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create review" });
    }
  });
  
  // Favorite routes
  app.get("/api/favorites", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    
    try {
      const favorites = await storage.getUserFavorites(req.user.id);
      
      // Get the cars for each favorite
      const favoriteCars = await Promise.all(
        favorites.map(async (fav) => {
          const car = await storage.getCar(fav.carId);
          return { favorite: fav, car };
        })
      );
      
      // Filter out any cars that no longer exist
      const validFavoriteCars = favoriteCars.filter(item => item.car !== undefined);
      
      res.json(validFavoriteCars);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch favorites" });
    }
  });
  
  app.post("/api/favorites", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    
    try {
      const { carId } = req.body;
      
      if (!carId) {
        return res.status(400).json({ error: "Missing carId" });
      }
      
      // Check if car exists
      const car = await storage.getCar(parseInt(carId));
      if (!car) {
        return res.status(404).json({ error: "Car not found" });
      }
      
      // Check if already favorited
      const isFavorite = await storage.isFavorite(req.user.id, parseInt(carId));
      if (isFavorite) {
        return res.status(400).json({ error: "Car already in favorites" });
      }
      
      const favorite = await storage.createFavorite({
        userId: req.user.id,
        carId: parseInt(carId)
      });
      
      res.status(201).json(favorite);
    } catch (error) {
      res.status(500).json({ error: "Failed to add to favorites" });
    }
  });
  
  app.delete("/api/favorites/:carId", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Unauthorized" });
    
    try {
      const carId = parseInt(req.params.carId);
      
      const deleted = await storage.deleteFavorite(req.user.id, carId);
      
      if (!deleted) {
        return res.status(404).json({ error: "Favorite not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to remove from favorites" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
