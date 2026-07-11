import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { CommentAuthor } from '@/hooks/useAuth';

export interface Comment {
  id: string;
  post_slug: string;
  user_id: string;
  author_name: string;
  author_avatar: string | null;
  content: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

/** A top-level comment with its (single level of) replies attached. */
export interface CommentThread extends Comment {
  replies: Comment[];
}

const commentsKey = (slug: string) => ['comments', slug] as const;

async function fetchComments(slug: string): Promise<Comment[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('comments')
    .select('id, post_slug, user_id, author_name, author_avatar, content, parent_id, created_at, updated_at')
    .eq('post_slug', slug)
    .eq('is_deleted', false)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

/** Group a flat comment list into top-level threads with one level of replies. */
export function toThreads(comments: Comment[]): CommentThread[] {
  const roots: CommentThread[] = [];
  const byId = new Map<string, CommentThread>();

  for (const c of comments) {
    if (!c.parent_id) {
      const thread: CommentThread = { ...c, replies: [] };
      byId.set(c.id, thread);
      roots.push(thread);
    }
  }
  for (const c of comments) {
    if (c.parent_id) {
      const parent = byId.get(c.parent_id);
      if (parent) parent.replies.push(c);
      else {
        // Orphaned reply (parent removed): promote to top level so it stays visible.
        byId.set(c.id, { ...c, replies: [] });
        roots.push(byId.get(c.id)!);
      }
    }
  }
  return roots;
}

export function useComments(slug: string) {
  return useQuery({
    queryKey: commentsKey(slug),
    queryFn: () => fetchComments(slug),
    enabled: !!slug && !!supabase,
    staleTime: 30 * 1000,
  });
}

interface AddCommentInput {
  content: string;
  author: CommentAuthor;
  parentId?: string | null;
}

export function useAddComment(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ content, author, parentId = null }: AddCommentInput) => {
      if (!supabase) throw new Error('Comments are not available.');
      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_slug: slug,
          user_id: author.id,
          author_name: author.name,
          author_avatar: author.avatar,
          content: content.trim(),
          parent_id: parentId,
        })
        .select()
        .single();
      if (error) throw error;
      return data as Comment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentsKey(slug) });
    },
  });
}

export function useDeleteComment(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId: string) => {
      if (!supabase) throw new Error('Comments are not available.');
      // Soft delete so any replies stay readable; RLS ensures self-only.
      const { error } = await supabase
        .from('comments')
        .update({ is_deleted: true })
        .eq('id', commentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentsKey(slug) });
    },
  });
}
