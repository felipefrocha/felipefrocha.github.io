import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, Clock, ChevronRight } from 'lucide-react';
import type { BlogPost } from '@/types/blog';

// Auto-refresh in development mode
const isDevelopment = import.meta.env.DEV;

export default function BlogPostPage() {
  const [, params] = useRoute('/blog/:slug');
  const slug = params?.slug || '';

  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ['/api/posts', slug],
    enabled: !!slug,
    staleTime: isDevelopment ? 0 : 5 * 60 * 1000,
    refetchInterval: isDevelopment ? 2000 : false,
  });

  const { data: allPosts } = useQuery<BlogPost[]>({
    queryKey: ['/api/posts'],
    staleTime: isDevelopment ? 0 : 5 * 60 * 1000,
    refetchInterval: isDevelopment ? 2000 : false,
  });

  if (isLoading) {
    return (
      <article className="py-8 md:py-12 px-6 md:px-8">
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-4 w-48 mb-8" />
          <Skeleton className="h-6 w-24 mb-4" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-4 w-32 mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </article>
    );
  }

  if (error || !post) {
    return (
      <article className="py-8 md:py-12 px-6 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The blog post you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </article>
    );
  }

  const relatedPosts = allPosts?.filter(p => p.slug !== slug).slice(0, 3) || [];

  return (
    <article className="py-8 md:py-12 px-6 md:px-8">
      <div className="max-w-3xl mx-auto">
        <nav 
          className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/blog" className="hover:text-foreground transition-colors">
            Blog
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground truncate">{post.title}</span>
        </nav>

        <header className="mb-8">
          <Badge variant="outline" className="mb-4">{post.category}</Badge>
          <h1 
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
            data-testid="text-post-title"
          >
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </span>
          </div>
        </header>

        <div className="prose prose-neutral dark:prose-invert max-w-none mb-12">
          <p className="text-lg text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>
          
          <Separator className="my-8" />

          <div 
            className="space-y-6"
            dangerouslySetInnerHTML={{ 
              __html: formatMarkdownContent(post.content) 
            }}
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-12">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="font-mono text-xs">
              #{tag}
            </Badge>
          ))}
        </div>

        {relatedPosts.length > 0 && (
          <>
            <Separator className="mb-12" />
            <section>
              <h2 className="text-2xl font-semibold mb-6">Related Posts</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <Link 
                    key={relatedPost.slug} 
                    href={`/blog/${relatedPost.slug}`}
                    className="block p-4 rounded-lg border border-border hover-elevate"
                    data-testid={`link-related-${relatedPost.slug}`}
                  >
                    <Badge variant="outline" className="mb-2 text-xs">
                      {relatedPost.category}
                    </Badge>
                    <h3 className="font-medium line-clamp-2">{relatedPost.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {relatedPost.readTime}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </article>
  );
}

function formatMarkdownContent(content: string): string {
  let html = content
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-6 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-8 mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre class="bg-muted p-4 rounded-lg overflow-x-auto my-4"><code class="font-mono text-sm">$2</code></pre>')
    .replace(/`([^`]+)`/gim, '<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">$1</code>')
    .replace(/^\- (.*$)/gim, '<li class="ml-4">$1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>');

  const paragraphs = html.split('\n\n').map(p => {
    if (p.startsWith('<h') || p.startsWith('<pre') || p.startsWith('<li') || p.startsWith('<ul') || p.startsWith('<ol')) {
      return p;
    }
    if (p.trim()) {
      return `<p class="text-muted-foreground leading-relaxed mb-4">${p}</p>`;
    }
    return '';
  });

  return paragraphs.join('\n');
}
