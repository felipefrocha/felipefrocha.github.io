import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommentsSection } from './CommentsSection';
import type { Comment } from '@/hooks/useComments';

const auth = vi.hoisted(() => ({
  value: {} as Record<string, unknown>,
}));
const data = vi.hoisted(() => ({
  comments: [] as Comment[],
  isLoading: false,
  addMutate: vi.fn(),
  deleteMutate: vi.fn(),
}));

vi.mock('@/hooks/useAuth', () => ({ useAuth: () => auth.value }));
vi.mock('@/hooks/useComments', async () => {
  const actual = await vi.importActual<typeof import('@/hooks/useComments')>('@/hooks/useComments');
  return {
    toThreads: actual.toThreads,
    useComments: () => ({ data: data.comments, isLoading: data.isLoading }),
    useAddComment: () => ({ mutateAsync: data.addMutate, isPending: false }),
    useDeleteComment: () => ({ mutateAsync: data.deleteMutate, isPending: false }),
  };
});

const signIn = vi.fn();
const signOut = vi.fn();

function signedOut() {
  return { user: null, author: null, loading: false, isConfigured: true, signIn, signOut };
}
function signedIn() {
  return {
    user: { id: 'u1' },
    author: { id: 'u1', name: 'Ada', avatar: null },
    loading: false,
    isConfigured: true,
    signIn,
    signOut,
  };
}

const comment: Comment = {
  id: 'c1',
  post_slug: 'slug',
  user_id: 'u1',
  author_name: 'Ada',
  author_avatar: null,
  content: 'Nice.',
  parent_id: null,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

beforeEach(() => {
  auth.value = signedOut();
  data.comments = [];
  data.isLoading = false;
  signIn.mockClear();
  signOut.mockClear();
});

describe('CommentsSection', () => {
  it('renders nothing when Supabase is not configured', () => {
    auth.value = { ...signedOut(), isConfigured: false };
    const { container } = render(<CommentsSection slug="s" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows a sign-in gate when signed out and triggers OAuth', async () => {
    render(<CommentsSection slug="s" />);
    expect(screen.getByText('Sign in to join the conversation.')).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('button-signin-github'));
    expect(signIn).toHaveBeenCalledWith('github');
    await userEvent.click(screen.getByTestId('button-signin-google'));
    expect(signIn).toHaveBeenCalledWith('google');
  });

  it('shows a loading skeleton while auth resolves', () => {
    auth.value = { ...signedOut(), loading: true };
    render(<CommentsSection slug="s" />);
    expect(screen.queryByTestId('button-signin-github')).not.toBeInTheDocument();
  });

  it('shows the composer and sign-out for signed-in users', async () => {
    auth.value = signedIn();
    render(<CommentsSection slug="s" />);
    expect(screen.getByText(/Commenting as/)).toBeInTheDocument();
    expect(screen.getByTestId('input-comment')).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('button-signout'));
    expect(signOut).toHaveBeenCalled();
  });

  it('renders the empty state when there are no comments', () => {
    render(<CommentsSection slug="s" />);
    expect(screen.getByTestId('comments-empty')).toBeInTheDocument();
  });

  it('renders comment threads and the count', () => {
    data.comments = [comment, { ...comment, id: 'c2', parent_id: 'c1', content: 'Agreed.' }];
    auth.value = signedIn();
    render(<CommentsSection slug="s" />);
    expect(screen.getByText('Nice.')).toBeInTheDocument();
    expect(screen.getByText('Agreed.')).toBeInTheDocument();
    // Heading shows the total count (2).
    expect(screen.getByRole('heading', { name: /2/ })).toBeInTheDocument();
  });

  it('shows a skeleton while comments load', () => {
    data.isLoading = true;
    render(<CommentsSection slug="s" />);
    expect(screen.queryByTestId('comments-empty')).not.toBeInTheDocument();
  });
});
