import { vi } from 'vitest';

/**
 * Builds a chainable Supabase client mock good enough for the comment layer.
 * `selectResult` is returned by terminal `select().eq().eq().order()` reads;
 * `mutationResult` is returned by insert/update/delete chains.
 */
export function createSupabaseMock(opts?: {
  selectResult?: { data: unknown; error: unknown };
  mutationResult?: { data: unknown; error: unknown };
  session?: unknown;
}) {
  const selectResult = opts?.selectResult ?? { data: [], error: null };
  const mutationResult = opts?.mutationResult ?? { data: null, error: null };

  // A thenable/chainable query builder. Every filter returns `this`; awaiting
  // it (or calling .single()) resolves to the appropriate canned result.
  const makeBuilder = (result: { data: unknown; error: unknown }) => {
    const builder: Record<string, unknown> = {};
    const chain = () => builder;
    builder.select = vi.fn(() => builder);
    builder.insert = vi.fn(() => makeBuilder(mutationResult));
    builder.update = vi.fn(() => makeBuilder(mutationResult));
    builder.delete = vi.fn(() => makeBuilder(mutationResult));
    builder.eq = vi.fn(chain);
    builder.order = vi.fn(() => Promise.resolve(result));
    builder.single = vi.fn(() => Promise.resolve(result));
    builder.then = (resolve: (v: unknown) => unknown) => Promise.resolve(result).then(resolve);
    return builder;
  };

  const authListeners: Array<(event: string, session: unknown) => void> = [];

  const client = {
    from: vi.fn(() => makeBuilder(selectResult)),
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: opts?.session ?? null } })),
      onAuthStateChange: vi.fn((cb: (e: string, s: unknown) => void) => {
        authListeners.push(cb);
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      }),
      signInWithOAuth: vi.fn(() => Promise.resolve({ data: {}, error: null })),
      signOut: vi.fn(() => Promise.resolve({ error: null })),
    },
    __emitAuth(event: string, session: unknown) {
      authListeners.forEach((cb) => cb(event, session));
    },
  };

  return client;
}
