import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  getAllBlogPosts, 
  getBlogPostBySlug, 
  getFeaturedBlogPosts,
  getProfile,
  getSocialLinks,
  getProjects,
  getSkills,
  getStats
} from "./content";
import { contactMessageSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/posts", (req, res) => {
    try {
      const posts = getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  app.get("/api/posts/featured", (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 3;
      const posts = getFeaturedBlogPosts(limit);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching featured posts:", error);
      res.status(500).json({ error: "Failed to fetch featured posts" });
    }
  });

  app.get("/api/posts/:slug", (req, res) => {
    try {
      const post = getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ error: "Failed to fetch post" });
    }
  });

  app.get("/api/profile", (req, res) => {
    try {
      const profile = getProfile();
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.get("/api/socials", (req, res) => {
    try {
      const socials = getSocialLinks();
      res.json(socials);
    } catch (error) {
      console.error("Error fetching socials:", error);
      res.status(500).json({ error: "Failed to fetch social links" });
    }
  });

  app.get("/api/projects", (req, res) => {
    try {
      const projects = getProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/skills", (req, res) => {
    try {
      const skills = getSkills();
      res.json(skills);
    } catch (error) {
      console.error("Error fetching skills:", error);
      res.status(500).json({ error: "Failed to fetch skills" });
    }
  });

  app.get("/api/stats", (req, res) => {
    try {
      const stats = getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/site-data", (req, res) => {
    try {
      const profile = getProfile();
      const socials = getSocialLinks();
      const projects = getProjects();
      const skills = getSkills();
      const stats = getStats();
      const featuredPosts = getFeaturedBlogPosts(3);
      
      res.json({
        profile,
        socials,
        projects,
        skills,
        stats,
        featuredPosts,
      });
    } catch (error) {
      console.error("Error fetching site data:", error);
      res.status(500).json({ error: "Failed to fetch site data" });
    }
  });

  app.post("/api/contact", (req, res) => {
    try {
      const result = contactMessageSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: result.error.flatten() 
        });
      }

      console.log("Contact message received:", result.data);
      
      res.json({ 
        success: true, 
        message: "Message received successfully" 
      });
    } catch (error) {
      console.error("Error processing contact:", error);
      res.status(500).json({ error: "Failed to process contact message" });
    }
  });

  return httpServer;
}
