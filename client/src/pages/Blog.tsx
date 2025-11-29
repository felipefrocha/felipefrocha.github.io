import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BlogPostCard } from '@/components/molecules/BlogPostCard';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';
import type { BlogPost } from '@/types/blog';

// Auto-refresh in development mode
const isDevelopment = import.meta.env.DEV;

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: posts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ['/api/posts'],
    staleTime: isDevelopment ? 0 : 5 * 60 * 1000,
    refetchInterval: isDevelopment ? 2000 : false,
  });

  if (isLoading) {
    return (
      <article className="py-8 md:py-12 px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-10 w-32 mb-4" />
          <Skeleton className="h-6 w-64 mb-8" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </article>
    );
  }

  if (error || !posts) {
    return (
      <article className="py-16 text-center">
        <p className="text-muted-foreground">Failed to load blog posts.</p>
      </article>
    );
  }

  const categories = Array.from(new Set(posts.map(post => post.category)));

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <article className="py-8 md:py-12 px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4" data-testid="text-blog-title">
            Blog
          </h1>
          <p className="text-lg text-muted-foreground">
            Thoughts, tutorials, and insights on web development.
          </p>
        </header>

        <div className="sticky top-14 z-30 bg-background/95 backdrop-blur py-4 -mx-6 px-6 md:-mx-8 md:px-8 border-b mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-posts"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCategory === null ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(null)}
                data-testid="badge-category-all"
              >
                All
              </Badge>
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                  data-testid={`badge-category-${category.toLowerCase()}`}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {filteredPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post, index) => (
              <BlogPostCard key={post.slug} post={post} featured={index === 0} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts found matching your criteria.</p>
          </div>
        )}
      </div>
    </article>
  );
}
