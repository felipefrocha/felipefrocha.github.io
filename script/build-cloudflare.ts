import { build as viteBuild } from "vite";
import { readFile, readdir, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import matter from "gray-matter";
import type { BlogPost } from "@shared/schema";

const CONTENT_DIR = path.join(process.cwd(), 'content');
const BLOG_DIR = path.join(CONTENT_DIR, 'blog');

function formatDate(date: Date | string | undefined): string {
  if (!date) return new Date().toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

async function loadBlogPosts(): Promise<BlogPost[]> {
  try {
    const files = (await readdir(BLOG_DIR)).filter(file => file.endsWith('.md'));
    
    const posts = await Promise.all(files.map(async (file) => {
      const filePath = path.join(BLOG_DIR, file);
      const fileContent = await readFile(filePath, 'utf-8');
      const { data, content } = matter(fileContent);
      
      const slug = file.replace('.md', '');
      
      return {
        slug,
        title: data.title || 'Untitled',
        excerpt: data.excerpt || '',
        content,
        date: formatDate(data.date),
        readTime: data.readTime || calculateReadTime(content),
        category: data.category || 'General',
        tags: data.tags || [],
        featured: data.featured || false,
      } as BlogPost;
    }));

    return posts.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}

async function loadJSONFile<T>(filePath: string, defaultValue: T): Promise<T> {
  try {
    if (existsSync(filePath)) {
      const content = await readFile(filePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
  }
  return defaultValue;
}

async function buildCloudflare() {
  console.log("Building for Cloudflare Pages...\n");

  // Build frontend
  console.log("Building client...");
  await viteBuild();

  // Load all content
  console.log("Loading content files...");
  const blogPosts = await loadBlogPosts();
  const profile = await loadJSONFile(
    path.join(CONTENT_DIR, 'profile.json'),
    {
      name: 'Felipe F. Rocha',
      tagline: 'Technologist & Writer',
      bio: `I'm a passionate developer with over 5 years of experience building web applications.`,
      email: 'contato@feliprocha.systems',
      location: 'Boston, MA',
    }
  );
  const socialLinks = await loadJSONFile(
    path.join(CONTENT_DIR, 'socials.json'),
    []
  );
  const projects = await loadJSONFile(
    path.join(CONTENT_DIR, 'projects.json'),
    []
  );
  const skills = await loadJSONFile(
    path.join(CONTENT_DIR, 'skills.json'),
    []
  );
  const stats = await loadJSONFile(
    path.join(CONTENT_DIR, 'stats.json'),
    []
  );

  // Generate content initialization file
  console.log("Bundling content for Functions...");
  const initContent = `
// Auto-generated content bundle - DO NOT EDIT
import { initContent } from './lib/content';

const content = ${JSON.stringify({
  blogPosts,
  profile,
  socialLinks,
  projects,
  skills,
  stats,
}, null, 2)};

initContent(content);
`;

  // Ensure functions directory exists
  const functionsDir = path.join(process.cwd(), 'functions');
  if (!existsSync(functionsDir)) {
    await mkdir(functionsDir, { recursive: true });
  }

  // Write the content initialization file
  await writeFile(
    path.join(functionsDir, '_init.ts'),
    initContent,
    'utf-8'
  );

  console.log("\n✅ Build complete!");
  console.log("\nNext steps:");
  console.log("1. Install Wrangler CLI: npm install -g wrangler");
  console.log("2. Login to Cloudflare: wrangler login");
  console.log("3. Deploy: wrangler pages deploy dist/public --project-name=<your-project-name>");
}

buildCloudflare().catch((err) => {
  console.error(err);
  process.exit(1);
});

