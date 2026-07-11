import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  fetchSiteData,
  fetchAllPosts,
  fetchPost,
  fetchProjects,
  fetchProfile,
  fetchSocials,
  fetchSkills,
  fetchStats,
  submitContactForm,
} from './api';

function mockFetchOnce(body: unknown, init: { ok?: boolean; status?: number } = {}) {
  const ok = init.ok ?? true;
  return vi.fn().mockResolvedValue({
    ok,
    status: init.status ?? (ok ? 200 : 500),
    json: async () => body,
  });
}

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetchOnce({}));
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('language-scoped fetchers', () => {
  it('fetchSiteData hits the localized site-data endpoint', async () => {
    const data = { profile: {}, socials: [], projects: [], skills: [], stats: [], featuredPosts: [] };
    const fetchMock = mockFetchOnce(data);
    vi.stubGlobal('fetch', fetchMock);
    await expect(fetchSiteData()).resolves.toEqual(data);
    expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/\/api\/(en|pt|es)\/site-data\.json$/));
  });

  it('fetchAllPosts requests the posts list', async () => {
    const fetchMock = mockFetchOnce([{ slug: 'a' }]);
    vi.stubGlobal('fetch', fetchMock);
    const posts = await fetchAllPosts();
    expect(posts).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/\/posts\.json$/));
  });

  it('fetchPost requests a single post by slug', async () => {
    const fetchMock = mockFetchOnce({ slug: 'agentic-sdlc' });
    vi.stubGlobal('fetch', fetchMock);
    const post = await fetchPost('agentic-sdlc');
    expect(post.slug).toBe('agentic-sdlc');
    expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/\/posts\/agentic-sdlc\.json$/));
  });

  it('fetchProjects requests the localized projects endpoint', async () => {
    vi.stubGlobal('fetch', mockFetchOnce([]));
    await expect(fetchProjects()).resolves.toEqual([]);
  });
});

describe('global fetchers', () => {
  it.each([
    ['fetchProfile', fetchProfile, '/api/profile.json'],
    ['fetchSocials', fetchSocials, '/api/socials.json'],
    ['fetchSkills', fetchSkills, '/api/skills.json'],
    ['fetchStats', fetchStats, '/api/stats.json'],
  ] as const)('%s hits %s', async (_name, fn, url) => {
    const fetchMock = mockFetchOnce([]);
    vi.stubGlobal('fetch', fetchMock);
    await fn();
    expect(fetchMock).toHaveBeenCalledWith(url);
  });
});

describe('error handling', () => {
  it('throws a generic error when a request fails', async () => {
    vi.stubGlobal('fetch', mockFetchOnce(null, { ok: false, status: 500 }));
    await expect(fetchAllPosts()).rejects.toThrow('Failed to fetch posts');
  });

  it('throws "Post not found" on a 404', async () => {
    vi.stubGlobal('fetch', mockFetchOnce(null, { ok: false, status: 404 }));
    await expect(fetchPost('missing')).rejects.toThrow('Post not found');
  });

  it('throws a generic post error on non-404 failures', async () => {
    vi.stubGlobal('fetch', mockFetchOnce(null, { ok: false, status: 500 }));
    await expect(fetchPost('x')).rejects.toThrow('Failed to fetch post');
  });

  it.each([
    ['fetchSiteData', fetchSiteData],
    ['fetchProjects', fetchProjects],
    ['fetchProfile', fetchProfile],
    ['fetchSocials', fetchSocials],
    ['fetchSkills', fetchSkills],
    ['fetchStats', fetchStats],
  ] as const)('%s rejects on failure', async (_n, fn) => {
    vi.stubGlobal('fetch', mockFetchOnce(null, { ok: false, status: 500 }));
    await expect(fn()).rejects.toThrow();
  });
});

describe('submitContactForm', () => {
  const payload = { name: 'A', email: 'a@b.c', subject: 's', message: 'message here', turnstileToken: 't' };

  it('POSTs the form and returns the parsed response', async () => {
    const fetchMock = mockFetchOnce({ success: true, message: 'ok' });
    vi.stubGlobal('fetch', fetchMock);
    const res = await submitContactForm(payload);
    expect(res.success).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith('/api/contact', expect.objectContaining({ method: 'POST' }));
  });

  it('throws the server error message on failure', async () => {
    vi.stubGlobal('fetch', mockFetchOnce({ error: 'nope' }, { ok: false, status: 400 }));
    await expect(submitContactForm(payload)).rejects.toThrow('nope');
  });
});
