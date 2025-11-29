import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { BlogPostCard } from '@/components/molecules/BlogPostCard';
import { ArrowRight } from 'lucide-react';
import type { BlogPost } from '@/types/blog';

interface RecentPostsSectionProps {
  posts: BlogPost[];
}

export function RecentPostsSection({ posts }: RecentPostsSectionProps) {
  return (
    <section className="py-16 md:py-20 px-6 md:px-8 bg-muted/30" data-testid="section-recent-posts">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Recent Posts
          </h2>
          <Button variant="ghost" asChild>
            <Link href="/blog">
              <a data-testid="link-view-all-posts">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </a>
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
