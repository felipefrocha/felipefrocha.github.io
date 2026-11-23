import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { BlogPostCard } from '@/components/molecules/BlogPostCard';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { SEO } from '@/components/atoms/SEO';
import { generateCollectionPageSchema } from '@/lib/structuredData';
import { Search } from 'lucide-react';
import type { BlogPost } from '@shared/schema';
import { fetchAllPosts } from '@/lib/api';

const isDevelopment = import.meta.env.DEV;

export default function Blog() {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: posts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ['/api/posts', i18n.language],
    queryFn: fetchAllPosts,
    staleTime: isDevelopment ? 0 : 5 * 60 * 1000,
    refetchInterval: isDevelopment ? 2000 : false,
  });

  if (isLoading) {
    return (
      <article className="py-10 md:py-14">
        <div className="container-default max-w-5xl mx-auto px-4 sm:px-6">
          <Skeleton className="h-9 w-32 mb-3" />
          <Skeleton className="h-5 w-72 mb-8" />
          <div className="grid gap-5 md:grid-cols-2">
            <Skeleton className="h-44 rounded-xl md:col-span-2" />
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-40 rounded-xl" />
          </div>
        </div>
      </article>
    );
  }

  if (error || !posts) {
    return (
      <article className="py-16 text-center">
        <p className="text-muted-foreground">{t('blog.failedToLoad')}</p>
      </article>
    );
  }

  const categories = Array.from(new Set(posts.map(post => post.category)));

  const filteredPosts = posts.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.feliperocha.systems';
  const blogUrl = `${siteUrl}/blog`;
  const collectionItems = posts.map(post => ({
    name: post.title,
    url: `${siteUrl}/blog/${post.slug}`,
  }));

  return (
    <article className="py-10 md:py-14">
      <SEO
        title="Blog"
        description="Read articles about software development, systems engineering, architecture, and technology insights."
        image="/assets/social-card-article.png"
        imageAlt="Systems Notes by Felipe F. Rocha"
        canonical={blogUrl}
        structuredData={generateCollectionPageSchema(
          'Blog Posts',
          'Collection of blog posts about software development and systems engineering',
          collectionItems
        )}
      />
      <div className="container-default max-w-5xl mx-auto px-4 sm:px-6">
        <header className="mb-8 max-w-2xl">
          <h1
            className="text-h1 text-3xl sm:text-4xl font-bold tracking-tight text-balance mb-3"
            data-testid="text-blog-title"
          >
            {t('blog.title')}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground text-pretty">
            {t('blog.description')}
          </p>
        </header>

        <search
          aria-label={t('blog.title')}
          className="sticky top-12 z-30 bg-background/90 backdrop-blur-md py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 border-b border-border/60 mb-8 block"
        >
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <label htmlFor="blog-search" className="sr-only">
                {t('blog.searchPlaceholder')}
              </label>
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="blog-search"
                name="q"
                type="search"
                placeholder={t('blog.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                className="pl-8 h-9 text-sm"
                data-testid="input-search-posts"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by category">
              <Badge
                asChild
                variant={selectedCategory === null ? 'default' : 'outline'}
                className="cursor-pointer font-normal"
              >
                <button
                  type="button"
                  aria-pressed={selectedCategory === null}
                  onClick={() => setSelectedCategory(null)}
                  data-testid="badge-category-all"
                >
                  {t('common.all')}
                </button>
              </Badge>
              {categories.map((category) => (
                <Badge
                  key={category}
                  asChild
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className="cursor-pointer font-normal"
                >
                  <button
                    type="button"
                    aria-pressed={selectedCategory === category}
                    onClick={() => setSelectedCategory(category)}
                    data-testid={`badge-category-${category.toLowerCase()}`}
                  >
                    {category}
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </search>

        {filteredPosts.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {filteredPosts.map((post, index) => (
              <BlogPostCard key={post.slug} post={post} featured={index === 0} />
            ))}
          </div>
        ) : (
          <div className="text-center py-14 border border-dashed border-border/60 rounded-xl">
            <p className="text-sm text-muted-foreground">{t('blog.noPostsFound')}</p>
          </div>
        )}
      </div>
    </article>
  );
}
