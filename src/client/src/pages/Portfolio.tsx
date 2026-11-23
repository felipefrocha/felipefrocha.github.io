import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Layers, FolderGit2 } from 'lucide-react';
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
    url: project.link
      ? (project.link.startsWith('/') ? `${siteUrl}${project.link}` : project.link)
      : portfolioUrl,
  }));

  const aiArchitectures = projects.filter(p => p.category === 'ai-architecture');
  const engineeringProjects = projects.filter(p => p.category !== 'ai-architecture');

  return (
    <article className="py-10 md:py-14">
      <SEO
        title="Portfolio"
        description="Explore my projects and AI architecture discussions. Showcase of software engineering projects, zero-trust agentic AI blueprints, and technical solutions."
        canonical={portfolioUrl}
        structuredData={generateCollectionPageSchema(
          'Portfolio Projects & AI Architecture Discussions',
          'Collection of software engineering projects and agentic AI architecture discussions',
          collectionItems
        )}
      />
      <div className="container-default max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        <header className="max-w-2xl">
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

        {aiArchitectures.length > 0 && (
          <section
            aria-labelledby="heading-ai-architecture"
            className="space-y-5"
            data-testid="section-portfolio-ai-architecture"
          >
            <div className="space-y-1.5 border-b border-border/50 pb-3">
              <div className="flex items-center gap-2 text-primary">
                <Layers className="h-4 w-4" aria-hidden="true" />
                <h2
                  id="heading-ai-architecture"
                  className="text-h2 text-xl sm:text-2xl font-semibold tracking-tight text-foreground"
                >
                  {t('portfolio.sections.aiArchitecture.title')}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl">
                {t('portfolio.sections.aiArchitecture.description')}
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {aiArchitectures.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>
        )}

        {engineeringProjects.length > 0 && (
          <section
            aria-labelledby="heading-engineering-projects"
            className="space-y-5"
            data-testid="section-portfolio-projects"
          >
            <div className="space-y-1.5 border-b border-border/50 pb-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <FolderGit2 className="h-4 w-4" aria-hidden="true" />
                <h2
                  id="heading-engineering-projects"
                  className="text-h2 text-xl sm:text-2xl font-semibold tracking-tight text-foreground"
                >
                  {t('portfolio.sections.projects.title')}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl">
                {t('portfolio.sections.projects.description')}
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {engineeringProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
