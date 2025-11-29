import { useQuery } from '@tanstack/react-query';
import { ProjectCard } from '@/components/molecules/ProjectCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { Project } from '@/types/blog';

// Auto-refresh in development mode
const isDevelopment = import.meta.env.DEV;

export default function Portfolio() {
  const { data: projects, isLoading, error } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
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
        <p className="text-muted-foreground">Failed to load projects.</p>
      </article>
    );
  }

  return (
    <article className="py-8 md:py-12 px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4" data-testid="text-portfolio-title">
            Portfolio
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            A collection of projects I've worked on, from personal experiments to 
            production applications. Each project represents a unique challenge and learning experience.
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
