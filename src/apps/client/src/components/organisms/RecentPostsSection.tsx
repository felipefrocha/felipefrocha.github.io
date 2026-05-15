import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { BlogPostCard } from '@/components/molecules/BlogPostCard';
import { ArrowRight } from 'lucide-react';
import type { BlogPost, ProfileInfo, SocialLink, Project } from '@shared/schema';

interface RecentPostsSectionProps {
  posts: BlogPost[];
}

export function RecentPostsSection({ posts }: RecentPostsSectionProps) {
  const { t } = useTranslation();
  return (
    <section className="py-16 md:py-20 px-6 md:px-8 bg-muted/30" data-testid="section-recent-posts">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            {t('sections.recentPosts')}
          </h2>
          <Button variant="ghost" asChild>
            <Link href="/blog" data-testid="link-view-all-posts">
              {t('common.viewAll')}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
