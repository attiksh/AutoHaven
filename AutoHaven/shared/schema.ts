import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name"),
  bio: text("bio"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
});

// Car condition enum
export const conditionEnum = pgEnum("condition", ["new", "like_new", "excellent", "good", "fair", "poor"]);

// Fuel type enum
export const fuelTypeEnum = pgEnum("fuel_type", ["gasoline", "diesel", "electric", "hybrid", "plug_in_hybrid", "other"]);

// Transmission type enum
export const transmissionEnum = pgEnum("transmission", ["automatic", "manual", "semi_automatic"]);

// Cars
export const cars = pgTable("cars", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  price: integer("price").notNull(),
  mileage: integer("mileage").notNull(),
  condition: conditionEnum("condition").notNull(),
  fuel: fuelTypeEnum("fuel").notNull(),
  transmission: transmissionEnum("transmission").notNull(),
  description: text("description").notNull(),
  features: text("features").array(),
  location: text("location").notNull(),
  images: text("images").array(),
  priceScore: integer("price_score"),
  exteriorColor: text("exterior_color"),
  interiorColor: text("interior_color"),
  vin: text("vin"),
  engineSize: text("engine_size"),
  horsepower: integer("horsepower"),
  mpgCity: integer("mpg_city"),
  mpgHighway: integer("mpg_highway"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCarSchema = createInsertSchema(cars).omit({
  id: true,
  createdAt: true,
});

// Messages
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull(),
  receiverId: integer("receiver_id").notNull(),
  carId: integer("car_id").notNull(),
  content: text("content").notNull(),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  read: true,
  createdAt: true,
});

// Reviews
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  reviewerId: integer("reviewer_id").notNull(),
  carId: integer("car_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

// Favorites
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  carId: integer("car_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCar = z.infer<typeof insertCarSchema>;
export type Car = typeof cars.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;
