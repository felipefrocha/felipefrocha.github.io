import type { BlogPost, Project, SocialLink, ProfileInfo } from '@/types/blog';

// todo: remove mock functionality - replace with actual data fetching
export const mockProfile: ProfileInfo = {
  name: 'Felipe F. Rocha',
  tagline: 'Systems Engineer',
  bio: `"I'm a passionate engineer with over 7 years of experience building and integrating complex systems. I love working with modern technologies and sharing my knowledge as I believe knowledge is not a property, but a responsibility. When I'm not coding, you'll find me exploring new tech, studying about software development best practices, or cooking for my family. X)",`,
  email: 'contato@feliprocha.systems',
  location: 'Boston, MA',
};

// todo: remove mock functionality
export const mockSocialLinks: SocialLink[] = [
  { platform: 'github', url: 'https://github.com', handle: 'felipefrocha' },
  { platform: 'linkedin', url: 'https://linkedin.com', handle: 'felipefonsecarocha' },
  { platform: 'instagram', url: 'https://instagram.com', handle: '_felipefrocha' },
];

// todo: remove mock functionality
export const mockProjects: Project[] = [
  {
    id: 'project-1',
    title: 'WIP - Work in Progress',
    description: 'This is a work in progress project. I will update it as I progress.',
    techStack: ['Terraform', 'AWS', 'CI/CD', 'GitHub Actions'],
    link: 'https://feliperocha.systems',
    github: 'https://github.com/felipefrocha',
  },
];

// todo: remove mock functionality
export const mockBlogPosts: BlogPost[] = [
  {
    slug: 'building-scalable-react-apps',
    title: 'Building Scalable React Applications',
    excerpt: 'Learn the patterns and practices for building React applications that scale with your team and codebase.',
    content: '# Building Scalable React Applications\n\nThis is sample content...',
    date: 'Nov 25, 2025',
    readTime: '8 min read',
    category: 'React',
    tags: ['react', 'architecture', 'typescript'],
    featured: true,
  },
  {
    slug: 'typescript-best-practices',
    title: 'TypeScript Best Practices in 2025',
    excerpt: 'A comprehensive guide to writing type-safe TypeScript code with modern patterns and utilities.',
    content: '# TypeScript Best Practices\n\nThis is sample content...',
    date: 'Nov 20, 2025',
    readTime: '6 min read',
    category: 'TypeScript',
    tags: ['typescript', 'javascript', 'types'],
  },
  {
    slug: 'modern-css-techniques',
    title: 'Modern CSS Techniques You Should Know',
    excerpt: 'Explore the latest CSS features including container queries, cascade layers, and the :has selector.',
    content: '# Modern CSS Techniques\n\nThis is sample content...',
    date: 'Nov 15, 2025',
    readTime: '5 min read',
    category: 'CSS',
    tags: ['css', 'web-development', 'design'],
  },
];

// todo: remove mock functionality
export const mockStats = [
  { value: '50+', label: 'Projects' },
  { value: '10K+', label: 'Blog Readers' },
  { value: '500+', label: 'GitHub Stars' },
  { value: '5+', label: 'Years Exp.' },
];

// todo: remove mock functionality
export const mockSkills = [
  'React', 'TypeScript', 'Node.js', 'Next.js', 'PostgreSQL',
  'MongoDB', 'GraphQL', 'REST APIs', 'Tailwind CSS', 'Docker',
  'AWS', 'Git', 'CI/CD', 'Testing', 'Agile',
];
