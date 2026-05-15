import type { BlogPost, Project, SocialLink, ProfileInfo } from '@shared/schema';

// Static content store for Cloudflare Pages (where FS is unavailable)
let _staticContent: {
  blogPosts?: BlogPost[];
  profile?: ProfileInfo;
  socialLinks?: SocialLink[];
  projects?: Project[];
  skills?: string[];
  stats?: { value: string; label: string }[];
} | null = null;

export function initContent(content: any) {
  _staticContent = content;
}

// Ensure fs/path imports are purely for Node environment and aren't bundled when _staticContent is used
async function getNodeFs() {
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    try {
      const fs = await import('node:fs');
      const path = await import('node:path');
      return { fs, path };
    } catch (e) {
      // Ignored
    }
  }
  return null;
}

async function ensureDirectories() {
  if (_staticContent) return;
  const nodeEnv = await getNodeFs();
  if (!nodeEnv) return;
  const { fs, path } = nodeEnv;
  
  const CONTENT_DIR = path.join(process.cwd(), 'content');
  const BLOG_DIR = path.join(CONTENT_DIR, 'blog');

  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }
}

export async function getAllBlogPostsAsync(): Promise<BlogPost[]> {
  if (_staticContent && _staticContent.blogPosts) {
    return _staticContent.blogPosts;
  }

  await ensureDirectories();
  const nodeEnv = await getNodeFs();
  if (!nodeEnv) return [];
  const { fs, path } = nodeEnv;
  const matter = (await import('gray-matter')).default;
  const CONTENT_DIR = path.join(process.cwd(), 'content');
  const BLOG_DIR = path.join(CONTENT_DIR, 'blog');

  try {
    const files = fs.readdirSync(BLOG_DIR).filter(file => file.endsWith('.md'));

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

    return posts.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error('Error reading blog directory:', error);
    return [];
  }
}

export function getAllBlogPosts(): BlogPost[] {
  if (_staticContent && _staticContent.blogPosts) {
    return _staticContent.blogPosts;
  }
  // Synchronous fallback is only safe if not relying on dynamic imports above, 
  // but for Express it's fine because we should use Async methods or pre-load.
  // For safety in Cloudflare, this must return _staticContent which is checked above.
  console.error("Synchronous getAllBlogPosts called without static content.");
  return [];
}

export function getBlogPostBySlug(slug: string, language: string = 'en'): BlogPost | undefined {
  const posts = getAllBlogPosts();
  // Try to find the exact language match, fallback to 'en', then fallback to any available
  return posts.find(post => post.slug === slug && post.language === language) || 
         posts.find(post => post.slug === slug && post.language === 'en') ||
         posts.find(post => post.slug === slug);
}

export function getFeaturedBlogPosts(limit: number = 3, language: string = 'en'): BlogPost[] {
  const posts = getAllBlogPosts().filter(p => p.language === language || p.language === 'en');
  // Deduplicate by slug, preferring the requested language
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
