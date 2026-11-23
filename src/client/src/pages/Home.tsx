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

const isDevelopment = import.meta.env.DEV;

export default function Home() {
  const { t, i18n } = useTranslation();
  const { data, isLoading, error } = useQuery<SiteData>({
    queryKey: ['/api/site-data', i18n.language],
    queryFn: fetchSiteData,
    staleTime: isDevelopment ? 0 : 5 * 60 * 1000,
    refetchInterval: isDevelopment ? 2000 : false,
  });

  if (isLoading) {
    return (
      <article className="py-12">
        <div className="container-default max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="py-12 space-y-4">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-14 w-96 max-w-full" />
            <Skeleton className="h-6 w-72 max-w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-40" />
            <div className="grid gap-5 md:grid-cols-2">
              <Skeleton className="h-48 rounded-xl" />
              <Skeleton className="h-48 rounded-xl" />
            </div>
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
