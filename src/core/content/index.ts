import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { BlogPost, Project, SocialLink, ProfileInfo } from '@shared/schema';

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

export function getAllBlogPosts(): BlogPost[] {
  try {
    if (!fs.existsSync(BLOG_DIR)) return [];
    
    const files = fs.readdirSync(BLOG_DIR).filter((file: string) => file.endsWith('.md'));
    const posts: BlogPost[] = [];
    
    for (const file of files) {
      try {
        const filePath = path.join(BLOG_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);

        const parts = file.split('.');
        parts.pop(); // remove 'md'
        const language = parts.length > 1 ? parts.pop() : 'en';
        const slug = parts.join('.');

        posts.push({
          slug,
          language: language || 'en',
          title: data.title || 'Untitled',
          excerpt: data.excerpt || '',
          content,
          date: formatDate(data.date),
          readTime: data.readTime || calculateReadTime(content),
          category: data.category || 'General',
          tags: data.tags || [],
          featured: data.featured || false,
          image: data.image || undefined,
        } as BlogPost);
      } catch (error) {
        console.error(`Error reading blog post ${file}:`, error);
      }
    }

    return posts.sort((a: any, b: any) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  } catch (e) {
    console.error("Error reading local fs", e);
    return [];
  }
}

export function getFeaturedBlogPosts(limit: number = 3, language: string = 'en'): BlogPost[] {
  const posts = getAllBlogPosts().filter(p => p.language === language || p.language === 'en');
  const uniquePosts = new Map<string, BlogPost>();
  
  for (const post of posts) {
    if (!uniquePosts.has(post.slug) || post.language === language) {
      uniquePosts.set(post.slug, post);
    }
  }
  
  const deduplicated = Array.from(uniquePosts.values());
  const featured = deduplicated.filter(post => post.featured);
  const regular = deduplicated.filter(post => !post.featured);
  return [...featured, ...regular].slice(0, limit);
}

export function getProfile(): ProfileInfo {
  try {
    const profilePath = path.join(CONTENT_DIR, 'profile.json');
    if (fs.existsSync(profilePath)) {
      const content = fs.readFileSync(profilePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Error reading profile:', error);
  }

  return {
    name: 'Felipe F. Rocha',
    tagline: 'Systems Engineer',
    bio: `"I'm a passionate engineer with over 7 years of experience building and integrating complex systems.`,
    email: 'contato@feliprocha.systems',
    location: 'Boston, MA',
  };
}

export function getSocialLinks(): SocialLink[] {
  try {
    const socialsPath = path.join(CONTENT_DIR, 'socials.json');
    if (fs.existsSync(socialsPath)) {
      const content = fs.readFileSync(socialsPath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Error reading social links:', error);
  }

  return [];
}

export function getProjects(): Project[] {
  try {
    const projectsPath = path.join(CONTENT_DIR, 'projects.json');
    if (fs.existsSync(projectsPath)) {
      const content = fs.readFileSync(projectsPath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Error reading projects:', error);
  }

  return [];
}

export function getSkills(): string[] {
  try {
    const skillsPath = path.join(CONTENT_DIR, 'skills.json');
    if (fs.existsSync(skillsPath)) {
      const content = fs.readFileSync(skillsPath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Error reading skills:', error);
  }

  return [];
}

export function getStats(): { value: string; label: string }[] {
  try {
    const statsPath = path.join(CONTENT_DIR, 'stats.json');
    if (fs.existsSync(statsPath)) {
      const content = fs.readFileSync(statsPath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Error reading stats:', error);
  }

  return [];
}