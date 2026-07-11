import { describe, it, expect } from 'vitest';
import {
  getAllBlogPosts,
  getFeaturedBlogPosts,
  getProfile,
  getSocialLinks,
  getProjects,
  getSkills,
  getStats,
} from './index';

const LANGS = ['en', 'pt', 'es'];

describe('getAllBlogPosts', () => {
  const posts = getAllBlogPosts();

  it('reads markdown posts from the content directory', () => {
    expect(posts.length).toBeGreaterThan(0);
  });

  it('parses slug and language from the filename', () => {
    for (const p of posts) {
      expect(p.slug).toBeTruthy();
      expect(LANGS).toContain(p.language);
      expect(typeof p.content).toBe('string');
      expect(Array.isArray(p.tags)).toBe(true);
    }
  });

  it('sorts posts by date descending', () => {
    const times = posts.map((p) => new Date(p.date).getTime());
    const sorted = [...times].sort((a, b) => b - a);
    expect(times).toEqual(sorted);
  });
});

describe('getFeaturedBlogPosts', () => {
  it('respects the limit and returns unique slugs', () => {
    const featured = getFeaturedBlogPosts(3, 'en');
    expect(featured.length).toBeLessThanOrEqual(3);
    const slugs = featured.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('prefers the requested language edition of a post', () => {
    const featuredPt = getFeaturedBlogPosts(5, 'pt');
    expect(featuredPt.every((p) => p.language === 'pt' || p.language === 'en')).toBe(true);
  });
});

describe('static content readers', () => {
  it('getProfile returns a profile with a name', () => {
    expect(getProfile().name).toBeTruthy();
  });

  it('getSocialLinks returns an array', () => {
    expect(Array.isArray(getSocialLinks())).toBe(true);
  });

  it('getSkills and getStats return arrays', () => {
    expect(Array.isArray(getSkills())).toBe(true);
    expect(Array.isArray(getStats())).toBe(true);
  });
});

describe('getProjects localization', () => {
  it('returns localized projects for a supported language', () => {
    const projects = getProjects('pt');
    expect(Array.isArray(projects)).toBe(true);
    for (const p of projects) {
      expect(typeof p.title).toBe('string');
      expect(typeof p.description).toBe('string');
      expect(Array.isArray(p.techStack)).toBe(true);
    }
  });

  it('falls back to English for an unsupported language code', () => {
    const enProjects = getProjects('en');
    const xxProjects = getProjects('zz-ZZ');
    expect(xxProjects.map((p) => p.title)).toEqual(enProjects.map((p) => p.title));
  });
});
