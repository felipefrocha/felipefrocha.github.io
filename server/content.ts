import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { BlogPost, Project, SocialLink, ProfileInfo } from '@shared/schema';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const BLOG_DIR = path.join(CONTENT_DIR, 'blog');

function ensureDirectories() {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }
}

export function getAllBlogPosts(): BlogPost[] {
  ensureDirectories();
  
  try {
    const files = fs.readdirSync(BLOG_DIR).filter(file => file.endsWith('.md'));
    
    const posts = files.map(file => {
      const filePath = path.join(BLOG_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
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
    });

    return posts.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return [];
  }
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  const posts = getAllBlogPosts();
  return posts.find(post => post.slug === slug);
}

export function getFeaturedBlogPosts(limit: number = 3): BlogPost[] {
  const posts = getAllBlogPosts();
  const featured = posts.filter(post => post.featured);
  const regular = posts.filter(post => !post.featured);
  return [...featured, ...regular].slice(0, limit);
}

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

export function getProfile(): ProfileInfo {
  const profilePath = path.join(CONTENT_DIR, 'profile.json');
  
  if (fs.existsSync(profilePath)) {
    try {
      const content = fs.readFileSync(profilePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error('Error reading profile:', error);
    }
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
  const socialsPath = path.join(CONTENT_DIR, 'socials.json');
  
  if (fs.existsSync(socialsPath)) {
    try {
      const content = fs.readFileSync(socialsPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error('Error reading social links:', error);
    }
  }
  
  return [
    { platform: 'github', url: 'https://github.com', handle: 'felipefrocha' },
    { platform: 'linkedin', url: 'https://linkedin.com', handle: 'felipefonsecarocha' },
    { platform: 'instagram', url: 'https://instagram.com', handle: '_felipefrocha' },
  ];
}

export function getProjects(): Project[] {
  const projectsPath = path.join(CONTENT_DIR, 'projects.json');
  
  if (fs.existsSync(projectsPath)) {
    try {
      const content = fs.readFileSync(projectsPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error('Error reading projects:', error);
    }
  }
  
  return [
    {
      id: 'project-1',
      title: 'WIP - Work in Progress',
      description: 'This is a work in progress project. I will update it as I progress.',
      techStack: ['Terraform', 'AWS', 'CI/CD', 'GitHub Actions'],
      link: 'https://feliperocha.systems',
      github: 'https://github.com/felipefrocha',
    },
  ];
}

export function getSkills(): string[] {
  const skillsPath = path.join(CONTENT_DIR, 'skills.json');
  
  if (fs.existsSync(skillsPath)) {
    try {
      const content = fs.readFileSync(skillsPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error('Error reading skills:', error);
    }
  }
  
  return [
    'React', 'TypeScript', 'Node.js', 'Next.js', 'PostgreSQL',
    'MongoDB', 'GraphQL', 'REST APIs', 'Tailwind CSS', 'Docker',
    'AWS', 'Git', 'CI/CD', 'Testing', 'Agile',
  ];
}

export function getStats(): { value: string; label: string }[] {
  const statsPath = path.join(CONTENT_DIR, 'stats.json');
  
  if (fs.existsSync(statsPath)) {
    try {
      const content = fs.readFileSync(statsPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error('Error reading stats:', error);
    }
  }
  
  return [
    { value: '50+', label: 'Projects' },
    { value: '10K+', label: 'Blog Readers' },
    { value: '500+', label: 'GitHub Stars' },
    { value: '5+', label: 'Years Exp.' },
  ];
}
