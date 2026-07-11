import { describe, it, expect } from 'vitest';
import {
  generateWebsiteSchema,
  generatePersonSchema,
  generateBlogPostSchema,
  generateBreadcrumbSchema,
  generateCollectionPageSchema,
} from './structuredData';
import type { BlogPost, ProfileInfo, SocialLink } from '@shared/schema';

const profile: ProfileInfo = {
  name: 'Felipe F. Rocha',
  tagline: 'Systems Engineer',
  bio: 'Builder of systems.',
  avatar: '/assets/avatar.jpg',
  email: 'test@example.com',
  location: 'Boston, MA',
};

const socials: SocialLink[] = [
  { platform: 'github', url: 'https://github.com', handle: 'felipefrocha' },
  { platform: 'linkedin', url: 'https://linkedin.com', handle: 'felipefonsecarocha' },
  { platform: 'instagram', url: 'https://instagram.com', handle: '_felipefrocha' },
];

const post: BlogPost = {
  slug: 'agentic-sdlc',
  language: 'en',
  title: 'The Agentic SDLC',
  excerpt: 'A blueprint.',
  content: 'body',
  date: '2026-05-31',
  readTime: '8 min read',
  category: 'AI Strategy',
  tags: ['ai', 'sdlc'],
};

describe('generateWebsiteSchema', () => {
  it('produces a WebSite node with a search action', () => {
    const schema = generateWebsiteSchema({ profile, socialLinks: socials });
    expect(schema['@type']).toBe('WebSite');
    expect(schema.potentialAction['@type']).toBe('SearchAction');
    expect(schema.author.sameAs).toContain('https://github.com/felipefrocha');
    expect(schema.author.sameAs).toContain('https://linkedin.com/in/felipefonsecarocha');
  });

  it('falls back to defaults with no options', () => {
    const schema = generateWebsiteSchema();
    expect(schema.author.name).toBe('Felipe F. Rocha');
    expect(schema.author.sameAs).toEqual([]);
  });
});

describe('generatePersonSchema', () => {
  it('maps profile and social handles', () => {
    const schema = generatePersonSchema(profile, socials);
    expect(schema['@type']).toBe('Person');
    expect(schema.name).toBe('Felipe F. Rocha');
    expect(schema.address?.addressLocality).toBe('Boston, MA');
    expect(schema.sameAs).toContain('https://instagram.com/_felipefrocha');
  });

  it('omits address when location is missing', () => {
    const schema = generatePersonSchema({ ...profile, location: undefined });
    expect(schema.address).toBeUndefined();
  });

  it('uses the raw url for unknown social platforms', () => {
    const schema = generatePersonSchema(profile, [
      { platform: 'mastodon' as never, url: 'https://mas.to/@felipe', handle: 'felipe' },
    ]);
    expect(schema.sameAs).toContain('https://mas.to/@felipe');
  });

  it('uses the default avatar when the profile has none', () => {
    const schema = generatePersonSchema({ ...profile, avatar: undefined });
    expect(schema.image).toMatch(/\/assets\/avatar\.jpg$/);
  });
});

describe('generateBlogPostSchema', () => {
  it('builds a BlogPosting with language and optional metadata', () => {
    const schema = generateBlogPostSchema(post, profile, { wordCount: 1200, commentCount: 3 });
    expect(schema['@type']).toBe('BlogPosting');
    expect(schema.inLanguage).toBe('en');
    expect(schema.isAccessibleForFree).toBe(true);
    expect(schema.wordCount).toBe(1200);
    expect(schema.commentCount).toBe(3);
    expect(schema.url).toContain('/blog/agentic-sdlc');
    expect(schema.keywords).toBe('ai, sdlc');
  });

  it('omits wordCount/commentCount when not provided', () => {
    const schema = generateBlogPostSchema(post);
    expect(schema).not.toHaveProperty('wordCount');
    expect(schema).not.toHaveProperty('commentCount');
  });

  it('uses absolute image URLs as-is', () => {
    const schema = generateBlogPostSchema({ ...post, image: 'https://cdn.example.com/x.png' });
    expect(schema.image).toBe('https://cdn.example.com/x.png');
  });
});

describe('generateBreadcrumbSchema', () => {
  it('numbers list items from 1', () => {
    const schema = generateBreadcrumbSchema([
      { name: 'Home', url: 'https://x/' },
      { name: 'Blog', url: 'https://x/blog' },
    ]);
    expect(schema.itemListElement).toHaveLength(2);
    expect(schema.itemListElement[0].position).toBe(1);
    expect(schema.itemListElement[1].name).toBe('Blog');
  });
});

describe('generateCollectionPageSchema', () => {
  it('wraps items in an ItemList', () => {
    const schema = generateCollectionPageSchema('Blog', 'desc', [
      { name: 'A', url: 'https://x/a' },
    ]);
    expect(schema.mainEntity.numberOfItems).toBe(1);
    expect(schema.mainEntity.itemListElement[0].item['@type']).toBe('Article');
  });
});
