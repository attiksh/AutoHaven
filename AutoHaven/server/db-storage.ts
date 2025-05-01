
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { 
  users, cars, messages, reviews, favorites,
  type User, type InsertUser,
  type Car, type InsertCar,
  type Message, type InsertMessage,
  type Review, type InsertReview,
  type Favorite, type InsertFavorite,
} from '@shared/schema';
import { IStorage } from './storage';
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client);

export class DbStorage implements IStorage {
  sessionStore = new MemoryStore({
    checkPeriod: 86400000
  });

  // User operations
  async getUser(id: number) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string) {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async getUserByEmail(email: string) {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(user: InsertUser) {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: number, userData: Partial<User>) {
    const result = await db.update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  // Car operations
  async getCars(filters: Record<string, any> = {}) {
    const query = db.select().from(cars);
    
    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        query.where(eq(cars[key], value));
      }
    });

    return query;
  }

  async getCar(id: number) {
    const result = await db.select().from(cars).where(eq(cars.id, id));
    return result[0];
  }

  async getUserCars(userId: number) {
    return db.select().from(cars).where(eq(cars.userId, userId));
  }

  async createCar(car: InsertCar) {
    const result = await db.insert(cars).values(car).returning();
    return result[0];
  }

  async updateCar(id: number, carData: Partial<Car>) {
    const result = await db.update(cars)
      .set(carData)
      .where(eq(cars.id, id))
      .returning();
    return result[0];
  }

  async deleteCar(id: number) {
    await db.delete(cars).where(eq(cars.id, id));
    return true;
  }
}
