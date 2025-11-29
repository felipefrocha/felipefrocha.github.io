import { useRoute, Link } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, Clock, ChevronRight } from 'lucide-react';
import { mockBlogPosts } from '@/lib/mockData';

export default function BlogPost() {
  const [, params] = useRoute('/blog/:slug');
  const slug = params?.slug;

  // todo: remove mock functionality - fetch post from API/markdown files
  const post = mockBlogPosts.find(p => p.slug === slug);

  if (!post) {
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

  const relatedPosts = mockBlogPosts.filter(p => p.slug !== slug).slice(0, 3);

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

          <div className="space-y-6">
            <h2>Introduction</h2>
            <p>
              This is where the full markdown content would be rendered. The blog system 
              supports markdown files that are parsed at build time, allowing you to write 
              content in a familiar format while getting the benefits of static generation.
            </p>

            <h2>Key Concepts</h2>
            <p>
              When building modern web applications, there are several key concepts to keep 
              in mind. First, focus on user experience and performance. Second, maintain 
              clean code architecture. Third, ensure accessibility and inclusivity.
            </p>

            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="font-mono text-sm">
{`// Example code block
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}`}
              </code>
            </pre>

            <h2>Conclusion</h2>
            <p>
              By following these practices, you can build applications that are both 
              maintainable and scalable. Remember to always keep learning and adapting 
              to new technologies and patterns.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-12">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="font-mono text-xs">
              #{tag}
            </Badge>
          ))}
        </div>

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
      </div>
    </article>
  );
}
