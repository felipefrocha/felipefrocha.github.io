import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { BlogPostCard } from '@/components/molecules/BlogPostCard';
import { ArrowRight } from 'lucide-react';
import type { BlogPost } from '@shared/schema';

interface RecentPostsSectionProps {
  posts: BlogPost[];
}

export function RecentPostsSection({ posts }: RecentPostsSectionProps) {
  const { t } = useTranslation();

  return (
    <section
      className="section-spacing py-12 md:py-16 border-b border-border/50"
      data-testid="section-recent-posts"
    >
      <div className="container-default max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-baseline justify-between gap-4 mb-6">
          <h2 className="text-h2 text-2xl sm:text-3xl font-semibold tracking-tight">
            {t('sections.recentPosts')}
          </h2>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground -mr-2" asChild>
            <Link href="/blog" data-testid="link-view-all-posts">
              {t('common.viewAll')}
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {posts.map((post, index) => (
            <BlogPostCard
              key={post.slug}
              post={post}
              featured={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
