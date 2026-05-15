import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { HeroSection } from '@/components/organisms/HeroSection';
import { FeaturedWorkSection } from '@/components/organisms/FeaturedWorkSection';
import { RecentPostsSection } from '@/components/organisms/RecentPostsSection';
import { AboutSection } from '@/components/organisms/AboutSection';
import { StatsSection } from '@/components/organisms/StatsSection';
import { ConnectSection } from '@/components/organisms/ConnectSection';
import { Skeleton } from '@/components/ui/skeleton';
import { SEO } from '@/components/atoms/SEO';
import { generateWebsiteSchema } from '@/lib/structuredData';
import { fetchSiteData, type SiteData } from '@/lib/api';

// Auto-refresh in development mode
const isDevelopment = import.meta.env.DEV;

export default function Home() {
  const { t } = useTranslation();
  const { data, isLoading, error } = useQuery<SiteData>({
    queryKey: ['/api/site-data'],
    queryFn: fetchSiteData,
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
        <p className="text-muted-foreground">{t('home.failedToLoad')}</p>
      </article>
    );
  }

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.feliperocha.systems';
  
  return (
    <article>
      <SEO
        title="Home"
        description="Systems Engineer, Developer, and Writer. Personal portfolio and blog showcasing projects, thoughts, and creative work."
        canonical={siteUrl}
        structuredData={generateWebsiteSchema({
          profile: data.profile,
          socialLinks: data.socials,
        })}
      />
      
      <HeroSection 
        headline={t('hero.headline')}
        subheadline={t('hero.subheadline')}
      />
      
      <FeaturedWorkSection projects={data.projects} />
      
      <RecentPostsSection posts={data.featuredPosts} />
      
      <AboutSection bio={data.profile.bio} skills={data.skills} />
      
      <StatsSection stats={data.stats} />
      
      <ConnectSection socialLinks={data.socials} />
    </article>
  );
}
