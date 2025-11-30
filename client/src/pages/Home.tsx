import { useQuery } from '@tanstack/react-query';
import { HeroSection } from '@/components/organisms/HeroSection';
import { FeaturedWorkSection } from '@/components/organisms/FeaturedWorkSection';
import { RecentPostsSection } from '@/components/organisms/RecentPostsSection';
import { AboutSection } from '@/components/organisms/AboutSection';
import { StatsSection } from '@/components/organisms/StatsSection';
import { ConnectSection } from '@/components/organisms/ConnectSection';
import { Skeleton } from '@/components/ui/skeleton';
import type { SiteData } from '@/lib/api';

// Auto-refresh in development mode
const isDevelopment = import.meta.env.DEV;

export default function Home() {
  const { data, isLoading, error } = useQuery<SiteData>({
    queryKey: ['/api/site-data'],
    staleTime: isDevelopment ? 0 : 5 * 60 * 1000,
    refetchInterval: isDevelopment ? 2000 : false,
  });

  if (isLoading) {
    return (
      <article className="space-y-16 py-8">
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-center space-y-4">
            <Skeleton className="h-16 w-96 mx-auto" />
            <Skeleton className="h-6 w-64 mx-auto" />
          </div>
        </div>
        <div className="px-6 md:px-8 max-w-6xl mx-auto space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid gap-6 md:grid-cols-3">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </article>
    );
  }

  if (error || !data) {
    return (
      <article className="py-16 text-center">
        <p className="text-muted-foreground">Failed to load content. Please try again.</p>
      </article>
    );
  }

  return (
    <article>
      <HeroSection 
        headline="Curious. Engineer. Builder."
        subheadline="Building digital experiences and sharing knowledge through code and words."
      />
      
      <FeaturedWorkSection projects={data.projects} />
      
      <RecentPostsSection posts={data.featuredPosts} />
      
      <AboutSection bio={data.profile.bio} skills={data.skills} />
      
      <StatsSection stats={data.stats} />
      
      <ConnectSection socialLinks={data.socials} />
    </article>
  );
}
