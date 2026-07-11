import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export type OAuthProvider = 'github' | 'google';

export interface CommentAuthor {
  id: string;
  name: string;
  avatar: string | null;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  author: CommentAuthor | null;
  signIn: (provider: OAuthProvider) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** Derive a display name + avatar from provider metadata, with sensible fallbacks. */
function toAuthor(user: User | null): CommentAuthor | null {
  if (!user) return null;
  const meta = user.user_metadata ?? {};
  const name =
    meta.full_name ||
    meta.name ||
    meta.user_name ||
    meta.preferred_username ||
    user.email?.split('@')[0] ||
    'Anonymous';
  const avatar = meta.avatar_url || meta.picture || null;
  return { id: user.id, name, avatar };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const user = session?.user ?? null;
    return {
      user,
      session,
      loading,
      isConfigured: isSupabaseConfigured,
      author: toAuthor(user),
      async signIn(provider: OAuthProvider) {
        if (!supabase) return;
        await supabase.auth.signInWithOAuth({
          provider,
          options: {
            // Return the reader to the exact post they were reading.
            redirectTo: typeof window !== 'undefined' ? window.location.href : undefined,
          },
        });
      },
      async signOut() {
        if (!supabase) return;
        await supabase.auth.signOut();
      },
    };
  }, [session, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
