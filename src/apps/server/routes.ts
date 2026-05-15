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
} from "@core/content/index";
import { contactMessageSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/posts", async (req, res) => {
    try {
      const language = (req.query.lang as string) || 'en';
      const allPosts = await getAllBlogPosts();
      
      // Filter for requested language, fallback to English if not available
      const uniquePosts = new Map();
      for (const post of allPosts) {
        if (post.language === language) {
          uniquePosts.set(post.slug, post);
        } else if (post.language === 'en' && !uniquePosts.has(post.slug)) {
          uniquePosts.set(post.slug, post);
        }
      }
      
      res.json(Array.from(uniquePosts.values()));
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  app.get("/api/posts/featured", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 3;
      const language = (req.query.lang as string) || 'en';
      const posts = await getFeaturedBlogPosts(limit, language);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching featured posts:", error);
      res.status(500).json({ error: "Failed to fetch featured posts" });
    }
  });

  app.get("/api/posts/:slug", async (req, res) => {
    try {
      const language = (req.query.lang as string) || 'en';
      const post = await getBlogPostBySlug(req.params.slug, language);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ error: "Failed to fetch post" });
    }
  });

  app.get("/api/profile", async (req, res) => {
    try {
      const profile = await getProfile();
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.get("/api/socials", async (req, res) => {
    try {
      const socials = await getSocialLinks();
      res.json(socials);
    } catch (error) {
      console.error("Error fetching socials:", error);
      res.status(500).json({ error: "Failed to fetch social links" });
    }
  });

  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await getProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/skills", async (req, res) => {
    try {
      const skills = await getSkills();
      res.json(skills);
    } catch (error) {
      console.error("Error fetching skills:", error);
      res.status(500).json({ error: "Failed to fetch skills" });
    }
  });

  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/site-data", async (req, res) => {
    try {
      const language = (req.query.lang as string) || 'en';
      const profile = await getProfile();
      const socials = await getSocialLinks();
      const projects = await getProjects();
      const skills = await getSkills();
      const stats = await getStats();
      const featuredPosts = await getFeaturedBlogPosts(3, language);
      
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
