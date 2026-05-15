import type { BlogPost, ProfileInfo, SocialLink, Project } from '@shared/schema';
import i18n from './i18n';

export interface SiteData {
  profile: ProfileInfo;
  socials: SocialLink[];
  projects: Project[];
  skills: string[];
  stats: { value: string; label: string }[];
  featuredPosts: BlogPost[];
}

const getLang = () => {
  const lang = i18n.language || 'en';
  return lang.split('-')[0];
};

export async function fetchSiteData(): Promise<SiteData> {
  const response = await fetch(`/api/${getLang()}/site-data.json`);
  if (!response.ok) throw new Error('Failed to fetch site data');
  return response.json();
}

export async function fetchAllPosts(): Promise<BlogPost[]> {
  const response = await fetch(`/api/${getLang()}/posts.json`);
  if (!response.ok) throw new Error('Failed to fetch posts');
  return response.json();
}

export async function fetchPost(slug: string): Promise<BlogPost> {
  const response = await fetch(`/api/${getLang()}/posts/${slug}.json`);
  if (!response.ok) {
    if (response.status === 404) throw new Error('Post not found');
    throw new Error('Failed to fetch post');
  }
  return response.json();
}

export async function fetchProjects(): Promise<Project[]> {
  const response = await fetch('/api/projects.json');
  if (!response.ok) throw new Error('Failed to fetch projects');
  return response.json();
}

export async function fetchProfile(): Promise<ProfileInfo> {
  const response = await fetch('/api/profile.json');
  if (!response.ok) throw new Error('Failed to fetch profile');
  return response.json();
}

export async function fetchSocials(): Promise<SocialLink[]> {
  const response = await fetch('/api/socials.json');
  if (!response.ok) throw new Error('Failed to fetch socials');
  return response.json();
}

export async function fetchSkills(): Promise<string[]> {
  const response = await fetch('/api/skills.json');
  if (!response.ok) throw new Error('Failed to fetch skills');
  return response.json();
}

export async function fetchStats(): Promise<{ value: string; label: string }[]> {
  const response = await fetch('/api/stats.json');
  if (!response.ok) throw new Error('Failed to fetch stats');
  return response.json();
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  turnstileToken: string;
}

export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean; message: string }> {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to submit contact form');
  }
  
  return response.json();
}