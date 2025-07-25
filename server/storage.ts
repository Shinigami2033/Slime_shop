import { users, newsletters, type User, type InsertUser, type Newsletter, type InsertNewsletter } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createNewsletter(newsletter: InsertNewsletter): Promise<Newsletter>;
  getAllNewsletters(): Promise<Newsletter[]>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize with default admin user
    this.ensureDefaultAdmin();
  }

  private async ensureDefaultAdmin() {
    try {
      // Check if admin user already exists
      const existingAdmin = await this.getUserByUsername("Admin2033");
      if (!existingAdmin) {
        // Create default admin user
        await this.createUser({
          username: "Admin2033",
          password: "1234"
        });
      }
    } catch (error) {
      console.error("Error ensuring default admin:", error);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createNewsletter(insertNewsletter: InsertNewsletter): Promise<Newsletter> {
    const [newsletter] = await db
      .insert(newsletters)
      .values(insertNewsletter)
      .returning();
    return newsletter;
  }

  async getAllNewsletters(): Promise<Newsletter[]> {
    return await db.select().from(newsletters);
  }
}

export const storage = new DatabaseStorage();
