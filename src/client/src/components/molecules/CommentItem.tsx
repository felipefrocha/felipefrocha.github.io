import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow, type Locale } from 'date-fns';
import { enUS, es, ptBR } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useDeleteComment, type Comment } from '@/hooks/useComments';
import { CommentForm } from '@/components/molecules/CommentForm';
import { MessageSquare, Trash2 } from 'lucide-react';

const DATE_LOCALES: Record<string, Locale> = { en: enUS, es, pt: ptBR };

interface CommentItemProps {
  comment: Comment;
  slug: string;
  isReply?: boolean;
}

export function CommentItem({ comment, slug, isReply = false }: CommentItemProps) {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const deleteComment = useDeleteComment(slug);
  const [replying, setReplying] = useState(false);

  const isOwner = user?.id === comment.user_id;
  const dateLocale = DATE_LOCALES[i18n.language.split('-')[0]] ?? enUS;
  const timeAgo = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
    locale: dateLocale,
  });
  const wasEdited = comment.updated_at !== comment.created_at;
  const initials = comment.author_name.slice(0, 2).toUpperCase();

  const handleDelete = async () => {
    try {
      await deleteComment.mutateAsync(comment.id);
    } catch (err) {
      toast({
        title: t('comments.failedTitle'),
        description: err instanceof Error ? err.message : t('comments.failedDescription'),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex gap-3" data-testid={`comment-${comment.id}`}>
      <Avatar className="h-9 w-9 shrink-0">
        {comment.author_avatar && <AvatarImage src={comment.author_avatar} alt={comment.author_name} />}
        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="font-medium text-sm">{comment.author_name}</span>
          <span className="text-xs text-muted-foreground">
            {timeAgo}
            {wasEdited && <span className="ml-1">· {t('comments.edited')}</span>}
          </span>
        </div>

        <p className="text-sm leading-relaxed mt-1 whitespace-pre-wrap break-words">
          {comment.content}
        </p>

        <div className="flex items-center gap-1 mt-1 -ml-2">
          {!isReply && user && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-muted-foreground"
              onClick={() => setReplying((v) => !v)}
              data-testid={`button-reply-${comment.id}`}
            >
              <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
              {t('comments.reply')}
            </Button>
          )}
          {isOwner && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
              onClick={handleDelete}
              disabled={deleteComment.isPending}
              data-testid={`button-delete-${comment.id}`}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              {t('comments.delete')}
            </Button>
          )}
        </div>

        {replying && (
          <div className="mt-3">
            <CommentForm
              slug={slug}
              parentId={comment.id}
              autoFocus
              onSubmitted={() => setReplying(false)}
              onCancel={() => setReplying(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
