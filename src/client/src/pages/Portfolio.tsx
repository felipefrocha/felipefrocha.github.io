import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ProjectCard } from '@/components/molecules/ProjectCard';
import { Skeleton } from '@/components/ui/skeleton';
import { SEO } from '@/components/atoms/SEO';
import { generateCollectionPageSchema } from '@/lib/structuredData';
import { fetchProjects } from '@/lib/api';
import type { Project } from '@shared/schema';

const isDevelopment = import.meta.env.DEV;

export default function Portfolio() {
  const { t, i18n } = useTranslation();
  const { data: projects, isLoading, error } = useQuery<Project[]>({
    queryKey: ['/api/projects', i18n.language],
    queryFn: fetchProjects,
    staleTime: isDevelopment ? 0 : 5 * 60 * 1000,
    refetchInterval: isDevelopment ? 2000 : false,
  });

  if (isLoading) {
    return (
      <article className="py-10 md:py-14">
        <div className="container-default max-w-5xl mx-auto px-4 sm:px-6">
          <Skeleton className="h-9 w-40 mb-3" />
          <Skeleton className="h-5 w-96 max-w-full mb-8" />
          <div className="grid gap-5 md:grid-cols-2">
            <Skeleton className="h-56 rounded-xl" />
            <Skeleton className="h-56 rounded-xl" />
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
    <article className="py-10 md:py-14">
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
      <div className="container-default max-w-5xl mx-auto px-4 sm:px-6">
        <header className="mb-8 max-w-2xl">
          <h1
            className="text-h1 text-3xl sm:text-4xl font-bold tracking-tight mb-3"
            data-testid="text-portfolio-title"
          >
            {t('portfolio.title')}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground text-pretty">
            {t('portfolio.description')}
          </p>
        </header>

        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </article>
  );
}
