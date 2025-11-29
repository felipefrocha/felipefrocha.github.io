import { ProjectCard } from '@/components/molecules/ProjectCard';
import { mockProjects } from '@/lib/mockData';

export default function Portfolio() {
  // todo: remove mock functionality - fetch projects from API
  const projects = mockProjects;

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
