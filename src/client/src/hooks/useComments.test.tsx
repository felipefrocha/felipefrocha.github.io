import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { makeQueryClient } from '@/test/utils';
import { createSupabaseMock } from '@/test/supabaseMock';
import { toThreads, useComments, useAddComment, useDeleteComment, type Comment } from './useComments';

const holder = vi.hoisted(() => ({ client: null as unknown }));
vi.mock('@/lib/supabase', () => ({
  get supabase() {
    return holder.client;
  },
  isSupabaseConfigured: true,
}));

function wrapper() {
  const client = makeQueryClient();
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

const baseComment = (over: Partial<Comment>): Comment => ({
  id: 'c1',
  post_slug: 'slug',
  user_id: 'u1',
  author_name: 'Ada',
  author_avatar: null,
  content: 'hi',
  parent_id: null,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  ...over,
});

describe('toThreads', () => {
  it('nests replies under their parent', () => {
    const threads = toThreads([
      baseComment({ id: 'a', parent_id: null }),
      baseComment({ id: 'b', parent_id: 'a' }),
      baseComment({ id: 'c', parent_id: null }),
    ]);
    expect(threads).toHaveLength(2);
    expect(threads[0].id).toBe('a');
    expect(threads[0].replies.map((r) => r.id)).toEqual(['b']);
  });

  it('promotes orphaned replies to top level', () => {
    const threads = toThreads([baseComment({ id: 'b', parent_id: 'missing' })]);
    expect(threads).toHaveLength(1);
    expect(threads[0].id).toBe('b');
    expect(threads[0].replies).toEqual([]);
  });
});

describe('useComments', () => {
  beforeEach(() => {
    holder.client = createSupabaseMock({
      selectResult: { data: [baseComment({ id: 'x' })], error: null },
    });
  });

  it('fetches comments for a slug', async () => {
    const { result } = renderHook(() => useComments('agentic-sdlc'), { wrapper: wrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect((holder.client as { from: ReturnType<typeof vi.fn> }).from).toHaveBeenCalledWith('comments');
  });
});

describe('useAddComment', () => {
  it('inserts a comment and resolves the created row', async () => {
    const created = baseComment({ id: 'new', content: 'posted' });
    holder.client = createSupabaseMock({ mutationResult: { data: created, error: null } });
    const { result } = renderHook(() => useAddComment('slug'), { wrapper: wrapper() });
    const returned = await result.current.mutateAsync({
      content: '  posted  ',
      author: { id: 'u1', name: 'Ada', avatar: null },
    });
    expect(returned).toEqual(created);
    const builder = (holder.client as { from: ReturnType<typeof vi.fn> }).from.mock.results[0].value;
    expect(builder.insert).toHaveBeenCalledWith(
      expect.objectContaining({ post_slug: 'slug', user_id: 'u1', content: 'posted', parent_id: null }),
    );
  });

  it('rejects when the insert errors', async () => {
    holder.client = createSupabaseMock({ mutationResult: { data: null, error: { message: 'denied' } } });
    const { result } = renderHook(() => useAddComment('slug'), { wrapper: wrapper() });
    await expect(
      result.current.mutateAsync({ content: 'x', author: { id: 'u1', name: 'Ada', avatar: null } }),
    ).rejects.toBeTruthy();
  });
});

describe('useDeleteComment', () => {
  it('soft-deletes by setting is_deleted', async () => {
    holder.client = createSupabaseMock({ mutationResult: { data: null, error: null } });
    const { result } = renderHook(() => useDeleteComment('slug'), { wrapper: wrapper() });
    await result.current.mutateAsync('c1');
    const builder = (holder.client as { from: ReturnType<typeof vi.fn> }).from.mock.results[0].value;
    expect(builder.update).toHaveBeenCalledWith({ is_deleted: true });
    // .eq() is called on the builder returned by .update().
    const afterUpdate = builder.update.mock.results[0].value;
    expect(afterUpdate.eq).toHaveBeenCalledWith('id', 'c1');
  });
});
