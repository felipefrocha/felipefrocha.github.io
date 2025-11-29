import type { BlogPost, Project, SocialLink, ProfileInfo } from '@/types/blog';

// todo: remove mock functionality - replace with actual data fetching
export const mockProfile: ProfileInfo = {
  name: 'Alex Developer',
  tagline: 'Full-Stack Developer & Writer',
  bio: `I'm a passionate developer with over 5 years of experience building web applications. 
  I love working with modern technologies and sharing my knowledge through writing. 
  When I'm not coding, you'll find me exploring new tech, contributing to open source, 
  or writing about software development best practices.`,
  email: 'hello@example.com',
  location: 'San Francisco, CA',
};

// todo: remove mock functionality
export const mockSocialLinks: SocialLink[] = [
  { platform: 'github', url: 'https://github.com', handle: 'alexdev' },
  { platform: 'linkedin', url: 'https://linkedin.com', handle: 'alexdev' },
  { platform: 'instagram', url: 'https://instagram.com', handle: 'alexdev' },
  { platform: 'twitter', url: 'https://twitter.com', handle: 'alexdev' },
];

// todo: remove mock functionality
export const mockProjects: Project[] = [
  {
    id: 'project-1',
    title: 'E-Commerce Platform',
    description: 'A modern e-commerce platform built with Next.js, featuring real-time inventory, secure payments, and an intuitive admin dashboard.',
    techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe'],
    link: 'https://example.com',
    github: 'https://github.com',
  },
  {
    id: 'project-2',
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates, team workspaces, and advanced filtering capabilities.',
    techStack: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
    link: 'https://example.com',
    github: 'https://github.com',
  },
  {
    id: 'project-3',
    title: 'Developer Portfolio',
    description: 'A performant portfolio site with markdown blog, PWA support, and a custom design system built with Tailwind CSS.',
    techStack: ['React', 'Vite', 'Tailwind CSS', 'MDX'],
    github: 'https://github.com',
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
