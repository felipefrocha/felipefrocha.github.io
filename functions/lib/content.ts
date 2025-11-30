// Content files will be bundled at build time
// This is a placeholder that will be replaced during the build process
import type { BlogPost, Project, SocialLink, ProfileInfo } from '@shared/schema';

// These will be injected during build
let BLOG_POSTS: BlogPost[] = [];
let PROFILE: ProfileInfo | null = null;
let SOCIAL_LINKS: SocialLink[] = [];
let PROJECTS: Project[] = [];
let SKILLS: string[] = [];
let STATS: { value: string; label: string }[] = [];

// Initialize function that will be called with bundled content
export function initContent(content: {
  blogPosts: BlogPost[];
  profile: ProfileInfo;
  socialLinks: SocialLink[];
  projects: Project[];
  skills: string[];
  stats: { value: string; label: string }[];
}) {
  BLOG_POSTS = content.blogPosts;
  PROFILE = content.profile;
  SOCIAL_LINKS = content.socialLinks;
  PROJECTS = content.projects;
  SKILLS = content.skills;
  STATS = content.stats;
}

export function getAllBlogPosts(): BlogPost[] {
  return BLOG_POSTS;
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(post => post.slug === slug);
}

export function getFeaturedBlogPosts(limit: number = 3): BlogPost[] {
  const featured = BLOG_POSTS.filter(post => post.featured);
  const regular = BLOG_POSTS.filter(post => !post.featured);
  return [...featured, ...regular].slice(0, limit);
}

export function getProfile(): ProfileInfo {
  if (!PROFILE) {
    return {
      name: 'Felipe F. Rocha',
      tagline: 'Systems Engineer',
      bio: `I'm a passionate engineer with over 7 years of experience building and integrating complex systems. I love working with modern technologies and sharing my knowledge as I believe knowledge is not a property, but a responsibility. When I'm not coding, you'll find me exploring new tech, studying about software development best practices, or cooking for my family. X)`,
      email: 'contato@feliprocha.systems',
      location: 'Boston, MA',
    };
  }
  return PROFILE;
}

export function getSocialLinks(): SocialLink[] {
  return SOCIAL_LINKS.length > 0 ? SOCIAL_LINKS : [
    { platform: 'github', url: 'https://github.com', handle: 'felipefrocha' },
    { platform: 'linkedin', url: 'https://linkedin.com', handle: 'felipefonsecarocha' },
    { platform: 'instagram', url: 'https://instagram.com', handle: '_felipefrocha' },
  ];
}

export function getProjects(): Project[] {
  return PROJECTS;
}

export function getSkills(): string[] {
  return SKILLS.length > 0 ? SKILLS : [
    'React', 'TypeScript', 'Node.js', 'Next.js', 'PostgreSQL',
    'MongoDB', 'GraphQL', 'REST APIs', 'Tailwind CSS', 'Docker',
    'AWS', 'Git', 'CI/CD', 'Testing', 'Agile',
  ];
}

export function getStats(): { value: string; label: string }[] {
  return STATS.length > 0 ? STATS : [
    { value: '50+', label: 'Projects' },
    { value: '10K+', label: 'Blog Readers' },
    { value: '500+', label: 'GitHub Stars' },
    { value: '5+', label: 'Years Exp.' },
  ];
}

