import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ProjectCard } from '@/components/molecules/ProjectCard';
import { Skeleton } from '@/components/ui/skeleton';
import { SEO } from '@/components/atoms/SEO';
import { generateCollectionPageSchema } from '@/lib/structuredData';
import { fetchProjects } from '@/lib/api';
import type { ProfileInfo, BlogPost, SocialLink, Project } from '@shared/schema';

// Auto-refresh in development mode
const isDevelopment = import.meta.env.DEV;

export default function Portfolio() {
  const { t } = useTranslation();
  const { data: projects, isLoading, error } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
    queryFn: fetchProjects,
    staleTime: isDevelopment ? 0 : 5 * 60 * 1000,
    refetchInterval: isDevelopment ? 2000 : false,
  });

  if (isLoading) {
    return (
      <article className="py-8 md:py-12 px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-10 w-40 mb-4" />
          <Skeleton className="h-6 w-96 mb-8" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </article>
    );
  }

  if (error || !projects) {
    return (
      <article className="py-16 text-center">
        <p className="text-muted-foreground">{t('portfolio.failedToLoad')}</p>
      </article>
    );
  }

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.feliperocha.systems';
  const portfolioUrl = `${siteUrl}/portfolio`;
  const collectionItems = projects.map(project => ({
    name: project.title,
    url: project.link || portfolioUrl,
  }));

  return (
    <article className="py-8 md:py-12 px-6 md:px-8">
      <SEO
        title="Portfolio"
        description="Explore my projects and work. Showcase of software engineering projects, systems architecture, and technical solutions."
        canonical={portfolioUrl}
        structuredData={generateCollectionPageSchema(
          'Portfolio Projects',
          'Collection of software engineering and systems architecture projects',
          collectionItems
        )}
      />
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4" data-testid="text-portfolio-title">
            {t('portfolio.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {t('portfolio.description')}
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </article>
  );
}
