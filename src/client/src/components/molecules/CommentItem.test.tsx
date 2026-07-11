import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from '@/lib/i18n';
import { CommentItem } from './CommentItem';
import type { Comment } from '@/hooks/useComments';

const state = vi.hoisted(() => ({
  user: { id: 'u1' } as { id: string } | null,
  deleteMutate: vi.fn(),
  addMutate: vi.fn(),
  toast: vi.fn(),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: state.user, author: { id: 'u1', name: 'Ada', avatar: null } }),
}));
vi.mock('@/hooks/useComments', () => ({
  useDeleteComment: () => ({ mutateAsync: state.deleteMutate, isPending: false }),
  useAddComment: () => ({ mutateAsync: state.addMutate, isPending: false }),
}));
vi.mock('@/hooks/use-toast', () => ({ useToast: () => ({ toast: state.toast }) }));

const comment: Comment = {
  id: 'c1',
  post_slug: 'slug',
  user_id: 'u1',
  author_name: 'Ada Lovelace',
  author_avatar: null,
  content: 'Insightful piece.',
  parent_id: null,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

beforeEach(() => {
  state.user = { id: 'u1' };
  state.deleteMutate = vi.fn().mockResolvedValue(undefined);
  state.addMutate = vi.fn().mockResolvedValue(undefined);
  state.toast = vi.fn();
});

describe('CommentItem', () => {
  it('renders author name and content', () => {
    render(<CommentItem comment={comment} slug="slug" />);
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByText('Insightful piece.')).toBeInTheDocument();
  });

  it('shows a delete button to the comment owner and deletes on click', async () => {
    render(<CommentItem comment={comment} slug="slug" />);
    const del = screen.getByTestId('button-delete-c1');
    await userEvent.click(del);
    expect(state.deleteMutate).toHaveBeenCalledWith('c1');
  });

  it('hides the delete button from non-owners', () => {
    state.user = { id: 'someone-else' };
    render(<CommentItem comment={comment} slug="slug" />);
    expect(screen.queryByTestId('button-delete-c1')).not.toBeInTheDocument();
  });

  it('toggles a reply form for top-level comments', async () => {
    render(<CommentItem comment={comment} slug="slug" />);
    expect(screen.queryByTestId('input-comment')).not.toBeInTheDocument();
    await userEvent.click(screen.getByTestId('button-reply-c1'));
    expect(screen.getByTestId('input-comment')).toBeInTheDocument();
  });

  it('does not offer a reply button on replies', () => {
    render(<CommentItem comment={comment} slug="slug" isReply />);
    expect(screen.queryByTestId('button-reply-c1')).not.toBeInTheDocument();
  });

  it('marks edited comments', () => {
    render(<CommentItem comment={{ ...comment, updated_at: '2026-02-02T00:00:00Z' }} slug="slug" />);
    expect(screen.getByText(/edited/)).toBeInTheDocument();
  });

  it('renders an avatar image when the author has one', () => {
    render(<CommentItem comment={{ ...comment, author_avatar: 'https://img/a.png' }} slug="slug" />);
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
  });

  it('closes the reply form after a successful reply', async () => {
    render(<CommentItem comment={comment} slug="slug" />);
    await userEvent.click(screen.getByTestId('button-reply-c1'));
    await userEvent.type(screen.getByTestId('input-comment'), 'my reply');
    await userEvent.click(screen.getByTestId('button-comment-submit'));
    await waitFor(() => expect(screen.queryByTestId('input-comment')).not.toBeInTheDocument());
    expect(state.addMutate).toHaveBeenCalledWith(
      expect.objectContaining({ content: 'my reply', parentId: 'c1' }),
    );
  });

  it('cancels the reply form', async () => {
    render(<CommentItem comment={comment} slug="slug" />);
    await userEvent.click(screen.getByTestId('button-reply-c1'));
    await userEvent.click(screen.getByTestId('button-comment-cancel'));
    expect(screen.queryByTestId('input-comment')).not.toBeInTheDocument();
  });

  it('falls back to the default date locale for unmapped languages', async () => {
    await i18n.changeLanguage('fr');
    render(<CommentItem comment={comment} slug="slug" />);
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    await i18n.changeLanguage('en');
  });

  it('shows a toast when deletion fails', async () => {
    state.deleteMutate = vi.fn().mockRejectedValue(new Error('denied'));
    render(<CommentItem comment={comment} slug="slug" />);
    await userEvent.click(screen.getByTestId('button-delete-c1'));
    await screen.findByText('Ada Lovelace');
    expect(state.toast).toHaveBeenCalledWith(expect.objectContaining({ variant: 'destructive' }));
  });
});
