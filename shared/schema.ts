import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const blogPostSchema = z.object({
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  content: z.string(),
  date: z.string(),
  readTime: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  featured: z.boolean().optional(),
});

export type BlogPost = z.infer<typeof blogPostSchema>;

export const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  techStack: z.array(z.string()),
  thumbnail: z.string().optional(),
  link: z.string().optional(),
  github: z.string().optional(),
});

export type Project = z.infer<typeof projectSchema>;

export const socialLinkSchema = z.object({
  platform: z.enum(['github', 'linkedin', 'instagram', 'twitter']),
  url: z.string(),
  handle: z.string(),
});

export type SocialLink = z.infer<typeof socialLinkSchema>;

export const profileSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  bio: z.string(),
  avatar: z.string().optional(),
  email: z.string().optional(),
  location: z.string().optional(),
});

export type ProfileInfo = z.infer<typeof profileSchema>;

export const contactMessageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactMessage = z.infer<typeof contactMessageSchema>;
