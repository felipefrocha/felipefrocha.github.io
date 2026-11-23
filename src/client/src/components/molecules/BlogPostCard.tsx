import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BlogPost } from '@shared/schema';

interface BlogPostCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogPostCard({ post, featured }: BlogPostCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        'group relative flex flex-col justify-between rounded-xl border border-border/70 bg-card/60 p-5 sm:p-6 transition-colors hover:border-foreground/25 hover:bg-card @container',
        featured && 'md:col-span-2 bg-card'
      )}
      data-testid={`card-blog-${post.slug}`}
    >
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2 text-xs font-mono text-muted-foreground">
          <span className="text-primary font-medium">{post.category}</span>
          <div className="flex items-center gap-2">
            <span>{post.date}</span>
            <span aria-hidden="true">·</span>
            <span>{post.readTime}</span>
          </div>
        </div>

        <h3
          className={cn(
            'font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors text-balance',
            featured ? 'text-xl @md:text-2xl' : 'text-base sm:text-lg'
          )}
        >
          {post.title}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 text-pretty max-w-2xl">
          {post.excerpt}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-mono group-hover:text-foreground transition-colors">
          Read article
        </span>
        <ArrowUpRight
          className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}
