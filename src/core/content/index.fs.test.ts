import { describe, it, expect, vi, beforeEach } from 'vitest';

// Force the filesystem error / missing-file fallback branches.
vi.mock('node:fs', () => ({
  default: {
    existsSync: vi.fn(),
    readdirSync: vi.fn(),
    readFileSync: vi.fn(),
  },
}));

import fs from 'node:fs';
import {
  getAllBlogPosts,
  getFeaturedBlogPosts,
  getProfile,
  getSocialLinks,
  getProjects,
  getSkills,
  getStats,
} from './index';

const mocked = fs as unknown as {
  existsSync: ReturnType<typeof vi.fn>;
  readdirSync: ReturnType<typeof vi.fn>;
  readFileSync: ReturnType<typeof vi.fn>;
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('content readers when files are missing', () => {
  beforeEach(() => {
    mocked.existsSync.mockReturnValue(false);
  });

  it('getAllBlogPosts returns [] when the blog dir is absent', () => {
    expect(getAllBlogPosts()).toEqual([]);
  });

  it('getFeaturedBlogPosts returns [] when there are no posts', () => {
    expect(getFeaturedBlogPosts(3, 'en')).toEqual([]);
  });

  it('getProfile returns the default profile', () => {
    expect(getProfile().name).toBe('Felipe F. Rocha');
  });

  it('getSocialLinks/getProjects/getSkills/getStats return empty arrays', () => {
    expect(getSocialLinks()).toEqual([]);
    expect(getProjects('en')).toEqual([]);
    expect(getSkills()).toEqual([]);
    expect(getStats()).toEqual([]);
  });
});

describe('content readers on filesystem errors', () => {
  it('getAllBlogPosts swallows readdir errors and returns []', () => {
    mocked.existsSync.mockReturnValue(true);
    mocked.readdirSync.mockImplementation(() => {
      throw new Error('EIO');
    });
    expect(getAllBlogPosts()).toEqual([]);
  });

  it('getAllBlogPosts skips individual files that fail to read', () => {
    mocked.existsSync.mockReturnValue(true);
    mocked.readdirSync.mockReturnValue(['broken.en.md'] as never);
    mocked.readFileSync.mockImplementation(() => {
      throw new Error('cannot read');
    });
    expect(getAllBlogPosts()).toEqual([]);
  });

  it('getProfile returns default when JSON parsing throws', () => {
    mocked.existsSync.mockReturnValue(true);
    mocked.readFileSync.mockReturnValue('not json{' as never);
    expect(getProfile().name).toBe('Felipe F. Rocha');
  });

  it('getSkills returns [] when reading throws', () => {
    mocked.existsSync.mockReturnValue(true);
    mocked.readFileSync.mockImplementation(() => {
      throw new Error('boom');
    });
    expect(getSkills()).toEqual([]);
  });
});

describe('getAllBlogPosts parsing', () => {
  it('parses frontmatter and defaults missing fields', () => {
    mocked.existsSync.mockReturnValue(true);
    mocked.readdirSync.mockReturnValue(['post.en.md', 'note.md'] as never);
    mocked.readFileSync.mockReturnValue('---\ntitle: Hello\n---\nBody content here.' as never);
    const posts = getAllBlogPosts();
    expect(posts).toHaveLength(2);
    const enPost = posts.find((p) => p.slug === 'post');
    expect(enPost?.language).toBe('en');
    expect(enPost?.title).toBe('Hello');
    // A file without a language segment defaults to 'en' with an "Untitled" fallback.
    const note = posts.find((p) => p.slug === 'note');
    expect(note?.title).toBe('Hello');
  });
});
