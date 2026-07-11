import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { makeQueryClient } from '@/test/utils';
import { useSiteData, useAllPosts, usePost, useProjects } from './useSiteData';

vi.mock('@/lib/api', () => ({
  fetchSiteData: vi.fn().mockResolvedValue({ profile: { name: 'Felipe' } }),
  fetchAllPosts: vi.fn().mockResolvedValue([{ slug: 'a' }]),
  fetchPost: vi.fn().mockResolvedValue({ slug: 'agentic-sdlc' }),
  fetchProjects: vi.fn().mockResolvedValue([{ id: 'p1' }]),
}));

function wrapper() {
  const client = makeQueryClient();
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

describe('useSiteData hooks', () => {
  it('useSiteData returns site data', async () => {
    const { result } = renderHook(() => useSiteData(), { wrapper: wrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.profile.name).toBe('Felipe');
  });

  it('useAllPosts returns the posts list', async () => {
    const { result } = renderHook(() => useAllPosts(), { wrapper: wrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
  });

  it('usePost fetches when a slug is present', async () => {
    const { result } = renderHook(() => usePost('agentic-sdlc'), { wrapper: wrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.slug).toBe('agentic-sdlc');
  });

  it('usePost stays idle for an empty slug', () => {
    const { result } = renderHook(() => usePost(''), { wrapper: wrapper() });
    expect(result.current.fetchStatus).toBe('idle');
    expect(result.current.data).toBeUndefined();
  });

  it('useProjects returns projects', async () => {
    const { result } = renderHook(() => useProjects(), { wrapper: wrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.[0].id).toBe('p1');
  });
});
