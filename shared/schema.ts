import { z } from "zod";

// User types
export interface User {
  id: number;
  username: string;
  password: string;
}

export const insertUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;

// Newsletter types
export interface Newsletter {
  id: number;
  email: string;
  subscribedAt: Date;
}

export const insertNewsletterSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
