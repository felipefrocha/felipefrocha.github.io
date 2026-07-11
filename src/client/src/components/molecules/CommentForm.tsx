import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useAddComment } from '@/hooks/useComments';
import { Send } from 'lucide-react';

const MAX_LENGTH = 5000;

interface CommentFormProps {
  slug: string;
  parentId?: string | null;
  autoFocus?: boolean;
  onSubmitted?: () => void;
  onCancel?: () => void;
}

export function CommentForm({ slug, parentId = null, autoFocus, onSubmitted, onCancel }: CommentFormProps) {
  const { t } = useTranslation();
  const { author } = useAuth();
  const { toast } = useToast();
  const addComment = useAddComment(slug);
  const [content, setContent] = useState('');

  const trimmed = content.trim();
  const canSubmit = trimmed.length > 0 && trimmed.length <= MAX_LENGTH && !addComment.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !canSubmit) return;

    try {
      await addComment.mutateAsync({ content: trimmed, author, parentId });
      setContent('');
      onSubmitted?.();
    } catch (err) {
      toast({
        title: t('comments.failedTitle'),
        description: err instanceof Error ? err.message : t('comments.failedDescription'),
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3" data-testid="form-comment">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={parentId ? t('comments.replyPlaceholder') : t('comments.placeholder')}
        rows={parentId ? 3 : 4}
        maxLength={MAX_LENGTH}
        autoFocus={autoFocus}
        className="resize-y"
        data-testid="input-comment"
      />
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground tabular-nums">
          {trimmed.length}/{MAX_LENGTH}
        </span>
        <div className="flex items-center gap-2">
          {onCancel && (
            <Button type="button" variant="ghost" size="sm" onClick={onCancel} data-testid="button-comment-cancel">
              {t('comments.cancel')}
            </Button>
          )}
          <Button type="submit" size="sm" disabled={!canSubmit} data-testid="button-comment-submit">
            <Send className="h-4 w-4 mr-2" />
            {addComment.isPending ? t('comments.submitting') : parentId ? t('comments.reply') : t('comments.submit')}
          </Button>
        </div>
      </div>
    </form>
  );
}
