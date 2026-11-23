import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SEO } from '@/components/atoms/SEO';
import { generateBlogPostSchema, generateBreadcrumbSchema } from '@/lib/structuredData';
import { ArrowLeft, Calendar, Clock, ChevronRight, MonitorPlay, UserRound } from 'lucide-react';
import type { BlogPost, ProfileInfo } from '@shared/schema';
import { fetchPost, fetchAllPosts, fetchProfile } from '@/lib/api';
import { renderMarkdown, countWords } from '@/lib/markdown';
import { CommentsSection } from '@/components/organisms/CommentsSection';

const isDevelopment = import.meta.env.DEV;

export default function BlogPostPage() {
  const { t, i18n } = useTranslation();
  const [, params] = useRoute('/blog/:slug');
  const slug = params?.slug || '';

  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ['/api/posts', slug, i18n.language],
    queryFn: () => fetchPost(slug),
    enabled: !!slug,
    staleTime: isDevelopment ? 0 : 5 * 60 * 1000,
    refetchInterval: isDevelopment ? 2000 : false,
  });

  const { data: allPosts } = useQuery<BlogPost[]>({
    queryKey: ['/api/posts', i18n.language],
    queryFn: fetchAllPosts,
    staleTime: isDevelopment ? 0 : 5 * 60 * 1000,
    refetchInterval: isDevelopment ? 2000 : false,
  });

  const { data: profile } = useQuery<ProfileInfo>({
    queryKey: ['/api/profile'],
    queryFn: fetchProfile,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <article className="py-10 md:py-14">
        <div className="container-narrow max-w-3xl mx-auto px-4 sm:px-6">
          <Skeleton className="h-4 w-48 mb-8" />
          <Skeleton className="h-5 w-24 mb-4" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-4 w-40 mb-8" />
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
      <article className="py-16">
        <div className="container-narrow max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-2xl font-bold mb-3">{t('blog.postNotFound')}</h1>
          <p className="text-muted-foreground mb-6">
            {t('blog.postNotFoundDescription')}
          </p>
          <Button asChild size="sm">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
              {t('blog.backToBlog')}
            </Link>
          </Button>
        </div>
      </article>
    );
  }

  const relatedPosts = allPosts?.filter(p => p.slug !== slug).slice(0, 3) || [];

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.feliperocha.systems';
  const postUrl = `${siteUrl}/blog/${slug}`;
  const publishedDate = post.date ? new Date(post.date).toISOString() : undefined;
  const author = post.author || profile?.name || 'Felipe F. Rocha';
  const breadcrumbItems = [
    { name: 'Home', url: siteUrl },
    { name: 'Blog', url: `${siteUrl}/blog` },
    { name: post.title, url: postUrl },
  ];

  return (
    <article className="py-10 md:py-14">
      <SEO
        title={post.title}
        description={post.excerpt}
        image={post.image || '/assets/social-card-article.png'}
        imageAlt={post.title}
        type="article"
        canonical={postUrl}
        publishedTime={publishedDate}
        modifiedTime={publishedDate}
        author={author}
        tags={post.tags}
        structuredData={[
          generateBlogPostSchema(post, profile || undefined, { wordCount: countWords(post.content) }),
          generateBreadcrumbSchema(breadcrumbItems),
        ]}
      />
      <div className="container-narrow max-w-3xl mx-auto px-4 sm:px-6">
        <nav
          className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground mb-8"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-foreground transition-colors">
            {t('nav.home')}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <Link href="/blog" className="hover:text-foreground transition-colors">
            {t('nav.blog')}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="text-foreground truncate">{post.title}</span>
        </nav>

        <header className="mb-10 pb-8 border-b border-border/60">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-muted-foreground mb-4">
            <span className="text-primary font-medium">{post.category}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              {post.date}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {post.readTime}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
              {author}
            </span>
          </div>

          <h1
            className="text-h1 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-balance mb-4"
            data-testid="text-post-title"
          >
            {post.title}
          </h1>

          <p className="text-body-lg text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty max-w-[65ch]">
            {post.excerpt}
          </p>
        </header>

        {post.presentationSlug && (
          <div className="mb-10 rounded-xl border border-border/70 bg-muted/30 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium">{t('presentation.articleCtaTitle')}</p>
                <p className="text-xs text-muted-foreground mt-1 text-pretty">
                  {t('presentation.articleCtaDescription')}
                </p>
              </div>
              <Button asChild size="sm" className="shrink-0">
                <Link href={`/presentations/${post.presentationSlug}`}>
                  <MonitorPlay className="h-3.5 w-3.5 mr-2" aria-hidden="true" />
                  {t('presentation.viewPresentation')}
                </Link>
              </Button>
            </div>
          </div>
        )}

        <div className="prose prose-neutral dark:prose-invert prose-measure max-w-[68ch] text-pretty mb-12">
          <div
            dangerouslySetInnerHTML={{
              __html: renderMarkdown(post.content),
            }}
          />
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pb-10 border-b border-border/60">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="font-mono text-xs font-normal">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {relatedPosts.length > 0 && (
          <section className="pt-10 defer-render">
            <h2 className="text-lg font-semibold tracking-tight text-balance mb-4">
              {t('blog.relatedPosts')}
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="group flex flex-col justify-between p-4 rounded-xl border border-border/70 bg-card/50 transition-colors hover:border-foreground/25 hover:bg-card"
                  data-testid={`link-related-${relatedPost.slug}`}
                >
                  <div>
                    <span className="block font-mono text-[11px] text-primary mb-1.5">
                      {relatedPost.category}
                    </span>
                    <h3 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {relatedPost.title}
                    </h3>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground mt-3">
                    {relatedPost.readTime}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <CommentsSection slug={slug} />
      </div>
    </article>
  );
}
