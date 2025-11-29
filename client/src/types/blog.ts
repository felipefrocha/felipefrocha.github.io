export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  featured?: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  thumbnail?: string;
  link?: string;
  github?: string;
}

export interface SocialLink {
  platform: 'github' | 'linkedin' | 'instagram' | 'twitter';
  url: string;
  handle: string;
}

export interface ProfileInfo {
  name: string;
  tagline: string;
  bio: string;
  avatar?: string;
  email?: string;
  location?: string;
}
