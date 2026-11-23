import { useTranslation } from 'react-i18next';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useComments, toThreads } from '@/hooks/useComments';
import { CommentForm } from '@/components/molecules/CommentForm';
import { CommentItem } from '@/components/molecules/CommentItem';
import { MessageCircle, LogOut } from 'lucide-react';

interface CommentsSectionProps {
  slug: string;
}

export function CommentsSection({ slug }: CommentsSectionProps) {
  const { t } = useTranslation();
  const { user, author, loading: authLoading, isConfigured, signIn, signOut } = useAuth();
  const { data: comments = [], isLoading } = useComments(slug);

  if (!isConfigured) return null;

  const threads = toThreads(comments);
  const count = comments.length;

  return (
    <section
      className="mt-12 pt-10 border-t border-border/60 defer-render"
      aria-labelledby="comments-heading"
      data-testid="comments-section"
    >
      <h2 id="comments-heading" className="text-lg font-semibold tracking-tight mb-6 flex items-center gap-2">
        <MessageCircle className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        {t('comments.title')}
        {count > 0 && <span className="text-muted-foreground font-normal text-sm">({count})</span>}
      </h2>

      <div className="mb-8">
        {authLoading ? (
          <Skeleton className="h-24 w-full rounded-xl" />
        ) : user && author ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t('comments.signedInAs', { name: author.name })}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => signOut()}
                data-testid="button-signout"
              >
                <LogOut className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                {t('comments.signOut')}
              </Button>
            </div>
            <CommentForm slug={slug} />
          </div>
        ) : (
          <div className="rounded-xl border border-border/70 bg-card/50 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">{t('comments.signInPrompt')}</p>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => signIn('github')} data-testid="button-signin-github">
                <FaGithub className="h-3.5 w-3.5 mr-2" aria-hidden="true" />
                {t('comments.signInWithGithub')}
              </Button>
              <Button variant="outline" size="sm" onClick={() => signIn('google')} data-testid="button-signin-google">
                <FaGoogle className="h-3.5 w-3.5 mr-2" aria-hidden="true" />
                {t('comments.signInWithGoogle')}
              </Button>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : threads.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4" data-testid="comments-empty">
          {t('comments.empty')}
        </p>
      ) : (
        <ol className="space-y-6">
          {threads.map((thread) => (
            <li key={thread.id} className="space-y-4">
              <CommentItem comment={thread} slug={slug} />
              {thread.replies.length > 0 && (
                <ol className="space-y-4 ml-5 md:ml-10 pl-4 border-l border-border/60">
                  {thread.replies.map((reply) => (
                    <li key={reply.id}>
                      <CommentItem comment={reply} slug={slug} isReply />
                    </li>
                  ))}
                </ol>
              )}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
