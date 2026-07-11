import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommentForm } from './CommentForm';

const state = vi.hoisted(() => ({
  author: { id: 'u1', name: 'Ada', avatar: null } as { id: string; name: string; avatar: string | null } | null,
  mutateAsync: vi.fn(),
  isPending: false,
  toast: vi.fn(),
}));

vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ author: state.author }) }));
vi.mock('@/hooks/useComments', () => ({
  useAddComment: () => ({ mutateAsync: state.mutateAsync, isPending: state.isPending }),
}));
vi.mock('@/hooks/use-toast', () => ({ useToast: () => ({ toast: state.toast }) }));

beforeEach(() => {
  state.author = { id: 'u1', name: 'Ada', avatar: null };
  state.mutateAsync = vi.fn().mockResolvedValue(undefined);
  state.isPending = false;
  state.toast = vi.fn();
});

describe('CommentForm', () => {
  it('disables submit until there is non-whitespace content', async () => {
    render(<CommentForm slug="s" />);
    const submit = screen.getByTestId('button-comment-submit');
    expect(submit).toBeDisabled();
    await userEvent.type(screen.getByTestId('input-comment'), '   ');
    expect(submit).toBeDisabled();
    await userEvent.type(screen.getByTestId('input-comment'), 'hello');
    expect(submit).toBeEnabled();
  });

  it('submits trimmed content and clears the field', async () => {
    render(<CommentForm slug="agentic-sdlc" />);
    await userEvent.type(screen.getByTestId('input-comment'), '  great post  ');
    await userEvent.click(screen.getByTestId('button-comment-submit'));
    expect(state.mutateAsync).toHaveBeenCalledWith({
      content: 'great post',
      author: state.author,
      parentId: null,
    });
    await waitFor(() => expect(screen.getByTestId('input-comment')).toHaveValue(''));
  });

  it('calls onSubmitted after a successful post', async () => {
    const onSubmitted = vi.fn();
    render(<CommentForm slug="s" onSubmitted={onSubmitted} />);
    await userEvent.type(screen.getByTestId('input-comment'), 'hi');
    await userEvent.click(screen.getByTestId('button-comment-submit'));
    await waitFor(() => expect(onSubmitted).toHaveBeenCalled());
  });

  it('shows a toast when posting fails', async () => {
    state.mutateAsync = vi.fn().mockRejectedValue(new Error('nope'));
    render(<CommentForm slug="s" />);
    await userEvent.type(screen.getByTestId('input-comment'), 'hi');
    await userEvent.click(screen.getByTestId('button-comment-submit'));
    await waitFor(() =>
      expect(state.toast).toHaveBeenCalledWith(expect.objectContaining({ variant: 'destructive' })),
    );
  });

  it('renders reply affordances (cancel button + reply label) when parentId is set', async () => {
    const onCancel = vi.fn();
    render(<CommentForm slug="s" parentId="p1" onCancel={onCancel} />);
    const cancel = screen.getByTestId('button-comment-cancel');
    expect(cancel).toBeInTheDocument();
    await userEvent.click(cancel);
    expect(onCancel).toHaveBeenCalled();
  });
});
