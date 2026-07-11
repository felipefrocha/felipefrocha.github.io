import { describe, it, expect, vi, afterEach } from 'vitest';
import { apiRequest, getQueryFn, queryClient } from './queryClient';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('apiRequest', () => {
  it('sends JSON body and content-type when data is provided', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal('fetch', fetchMock);
    await apiRequest('POST', '/api/x', { a: 1 });
    expect(fetchMock).toHaveBeenCalledWith('/api/x', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ a: 1 }),
      credentials: 'include',
    }));
  });

  it('omits body/content-type when no data', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal('fetch', fetchMock);
    await apiRequest('GET', '/api/y');
    const call = fetchMock.mock.calls[0][1];
    expect(call.body).toBeUndefined();
    expect(call.headers).toEqual({});
  });

  it('throws with status and body text on non-ok response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      text: async () => 'missing',
    });
    vi.stubGlobal('fetch', fetchMock);
    await expect(apiRequest('GET', '/api/z')).rejects.toThrow('404: missing');
  });
});

describe('getQueryFn', () => {
  it('returns parsed JSON on success', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ ok: 1 }) });
    vi.stubGlobal('fetch', fetchMock);
    const fn = getQueryFn({ on401: 'throw' });
    const result = await fn({ queryKey: ['/api', 'thing'] } as never);
    expect(result).toEqual({ ok: 1 });
    expect(fetchMock).toHaveBeenCalledWith('/api/thing', { credentials: 'include' });
  });

  it('returns null on 401 when configured to returnNull', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 401 });
    vi.stubGlobal('fetch', fetchMock);
    const fn = getQueryFn({ on401: 'returnNull' });
    await expect(fn({ queryKey: ['/api/secure'] } as never)).resolves.toBeNull();
  });

  it('throws on 401 when configured to throw', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 401, statusText: 'Unauthorized', text: async () => '' });
    vi.stubGlobal('fetch', fetchMock);
    const fn = getQueryFn({ on401: 'throw' });
    await expect(fn({ queryKey: ['/api/secure'] } as never)).rejects.toThrow('401');
  });
});

describe('queryClient', () => {
  it('is configured with retry disabled', () => {
    expect(queryClient.getDefaultOptions().queries?.retry).toBe(false);
    expect(queryClient.getDefaultOptions().mutations?.retry).toBe(false);
  });
});
