import { describe, it, expect } from 'vitest';
import {
  blogPostSchema,
  projectSchema,
  socialLinkSchema,
  profileSchema,
  contactMessageSchema,
  insertUserSchema,
} from './schema';

describe('blogPostSchema', () => {
  it('defaults language to "en"', () => {
    const parsed = blogPostSchema.parse({
      slug: 's',
      title: 't',
      excerpt: 'e',
      content: 'c',
      date: '2026-01-01',
      readTime: '1 min read',
      category: 'General',
      tags: [],
    });
    expect(parsed.language).toBe('en');
  });

  it('rejects a missing title', () => {
    expect(() =>
      blogPostSchema.parse({ slug: 's', excerpt: 'e', content: 'c', date: 'd', readTime: 'r', category: 'c', tags: [] }),
    ).toThrow();
  });
});

describe('projectSchema', () => {
  it('accepts a minimal project', () => {
    const p = projectSchema.parse({ id: '1', title: 't', description: 'd', techStack: ['ts'] });
    expect(p.techStack).toEqual(['ts']);
  });
});

describe('socialLinkSchema', () => {
  it('accepts known platforms', () => {
    expect(socialLinkSchema.parse({ platform: 'github', url: 'https://x', handle: 'h' }).platform).toBe('github');
  });

  it('rejects unknown platforms', () => {
    expect(() => socialLinkSchema.parse({ platform: 'tiktok', url: 'https://x', handle: 'h' })).toThrow();
  });
});

describe('profileSchema', () => {
  it('requires name, tagline and bio', () => {
    expect(() => profileSchema.parse({ name: 'n' })).toThrow();
    expect(profileSchema.parse({ name: 'n', tagline: 't', bio: 'b' }).name).toBe('n');
  });
});

describe('contactMessageSchema', () => {
  const valid = {
    name: 'Ada',
    email: 'ada@example.com',
    subject: 'Hi',
    message: 'This is a long enough message.',
    turnstileToken: 'token',
  };

  it('accepts a valid message', () => {
    expect(contactMessageSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects invalid email', () => {
    expect(contactMessageSchema.safeParse({ ...valid, email: 'nope' }).success).toBe(false);
  });

  it('rejects short messages', () => {
    expect(contactMessageSchema.safeParse({ ...valid, message: 'short' }).success).toBe(false);
  });

  it('requires a turnstile token', () => {
    expect(contactMessageSchema.safeParse({ ...valid, turnstileToken: '' }).success).toBe(false);
  });
});

describe('insertUserSchema', () => {
  it('picks username and password', () => {
    const u = insertUserSchema.parse({ username: 'u', password: 'p' });
    expect(u).toEqual({ username: 'u', password: 'p' });
  });
});
