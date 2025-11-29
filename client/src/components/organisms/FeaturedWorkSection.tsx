import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/molecules/ProjectCard';
import { ArrowRight } from 'lucide-react';
import type { Project } from '@/types/blog';

interface FeaturedWorkSectionProps {
  projects: Project[];
}

export function FeaturedWorkSection({ projects }: FeaturedWorkSectionProps) {
  return (
    <section className="py-16 md:py-20 px-6 md:px-8" data-testid="section-featured-work">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Featured Work
          </h2>
          <Button variant="ghost" asChild>
            <Link href="/portfolio" data-testid="link-view-portfolio">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
