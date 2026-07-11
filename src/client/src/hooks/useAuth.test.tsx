import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { createSupabaseMock } from '@/test/supabaseMock';
import { AuthProvider, useAuth } from './useAuth';

const holder = vi.hoisted(() => ({ client: null as unknown }));
vi.mock('@/lib/supabase', () => ({
  get supabase() {
    return holder.client;
  },
  get isSupabaseConfigured() {
    return holder.client !== null;
  },
}));

const wrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>;

function sessionWith(metadata: Record<string, unknown>, email = 'user@example.com') {
  return { user: { id: 'u1', email, user_metadata: metadata } };
}

describe('useAuth', () => {
  beforeEach(() => {
    holder.client = createSupabaseMock();
  });

  it('throws when used outside an AuthProvider', () => {
    expect(() => renderHook(() => useAuth())).toThrow(/AuthProvider/);
  });

  it('resolves to a signed-out state when there is no session', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toBeNull();
    expect(result.current.author).toBeNull();
    expect(result.current.isConfigured).toBe(true);
  });

  it('derives the display name from full_name and avatar_url', async () => {
    holder.client = createSupabaseMock({ session: sessionWith({ full_name: 'Ada Lovelace', avatar_url: 'a.png' }) });
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.author).not.toBeNull());
    expect(result.current.author?.name).toBe('Ada Lovelace');
    expect(result.current.author?.avatar).toBe('a.png');
  });

  it('falls back to the email prefix when no name metadata exists', async () => {
    holder.client = createSupabaseMock({ session: sessionWith({}, 'grace@navy.mil') });
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.author).not.toBeNull());
    expect(result.current.author?.name).toBe('grace');
    expect(result.current.author?.avatar).toBeNull();
  });

  it('signIn delegates to supabase OAuth with the chosen provider', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.signIn('github');
    });
    const auth = (holder.client as { auth: { signInWithOAuth: ReturnType<typeof vi.fn> } }).auth;
    expect(auth.signInWithOAuth).toHaveBeenCalledWith(
      expect.objectContaining({ provider: 'github' }),
    );
  });

  it('signOut delegates to supabase', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.signOut();
    });
    const auth = (holder.client as { auth: { signOut: ReturnType<typeof vi.fn> } }).auth;
    expect(auth.signOut).toHaveBeenCalled();
  });

  it('updates when an auth state change is emitted', async () => {
    const mock = createSupabaseMock();
    holder.client = mock;
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => {
      (mock as unknown as { __emitAuth: (e: string, s: unknown) => void }).__emitAuth(
        'SIGNED_IN',
        sessionWith({ name: 'Neo' }),
      );
    });
    await waitFor(() => expect(result.current.author?.name).toBe('Neo'));
  });
});

describe('useAuth without configured supabase', () => {
  it('is not configured and not loading', async () => {
    holder.client = null;
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isConfigured).toBe(false);
  });
});
