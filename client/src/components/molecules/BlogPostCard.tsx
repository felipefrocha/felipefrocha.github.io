import { Link } from 'wouter';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import type { BlogPost } from '@/types/blog';

interface BlogPostCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogPostCard({ post, featured }: BlogPostCardProps) {
  return (
    <Link 
      href={`/blog/${post.slug}`}
      className="block group"
      data-testid={`card-blog-${post.slug}`}
    >
      <Card className={cn(
        'h-full transition-all hover-elevate',
        featured && 'md:col-span-2'
      )}>
        <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
          <Badge variant="outline" className="font-mono text-xs">
            {post.category}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <h3 className={cn(
            'font-semibold tracking-tight group-hover:text-primary transition-colors',
            featured ? 'text-xl md:text-2xl' : 'text-lg'
          )}>
            {post.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.readTime}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
