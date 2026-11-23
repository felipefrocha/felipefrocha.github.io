import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/molecules/ProjectCard';
import { ArrowRight } from 'lucide-react';
import type { Project } from '@shared/schema';

interface FeaturedWorkSectionProps {
  projects: Project[];
}

export function FeaturedWorkSection({ projects }: FeaturedWorkSectionProps) {
  const { t } = useTranslation();

  return (
    <section
      className="section-spacing py-12 md:py-16 border-b border-border/50"
      data-testid="section-featured-work"
    >
      <div className="container-default max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-baseline justify-between gap-4 mb-6">
          <h2 className="text-h2 text-2xl sm:text-3xl font-semibold tracking-tight">
            {t('sections.featuredWork')}
          </h2>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground -mr-2" asChild>
            <Link href="/portfolio" data-testid="link-view-portfolio">
              {t('common.viewAll')}
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
