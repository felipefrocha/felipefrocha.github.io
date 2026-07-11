import { useTranslation } from 'react-i18next';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
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

  // Comments are an optional enhancement — stay silent if the backend isn't wired up.
  if (!isConfigured) return null;

  const threads = toThreads(comments);
  const count = comments.length;

  return (
    <section className="mt-16" aria-labelledby="comments-heading" data-testid="comments-section">
      <Separator className="mb-8" />
      <h2 id="comments-heading" className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <MessageCircle className="h-6 w-6" />
        {t('comments.title')}
        {count > 0 && <span className="text-muted-foreground font-normal">({count})</span>}
      </h2>

      {/* Composer / sign-in gate */}
      <div className="mb-8">
        {authLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : user && author ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{t('comments.signedInAs', { name: author.name })}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => signOut()}
                data-testid="button-signout"
              >
                <LogOut className="h-3.5 w-3.5 mr-1.5" />
                {t('comments.signOut')}
              </Button>
            </div>
            <CommentForm slug={slug} />
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground mb-4">{t('comments.signInPrompt')}</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button variant="outline" onClick={() => signIn('github')} data-testid="button-signin-github">
                <FaGithub className="h-4 w-4 mr-2" />
                {t('comments.signInWithGithub')}
              </Button>
              <Button variant="outline" onClick={() => signIn('google')} data-testid="button-signin-google">
                <FaGoogle className="h-4 w-4 mr-2" />
                {t('comments.signInWithGoogle')}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Thread list */}
      {isLoading ? (
        <div className="space-y-6">
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : threads.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6" data-testid="comments-empty">
          {t('comments.empty')}
        </p>
      ) : (
        <ol className="space-y-8">
          {threads.map((thread) => (
            <li key={thread.id} className="space-y-4">
              <CommentItem comment={thread} slug={slug} />
              {thread.replies.length > 0 && (
                <ol className="space-y-4 ml-6 md:ml-12 pl-4 border-l border-border">
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
