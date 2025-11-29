import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github } from 'lucide-react';
import type { Project } from '@/types/blog';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card 
      className="h-full transition-all hover-elevate group"
      data-testid={`card-project-${project.id}`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg group-hover:text-primary transition-colors">
          {project.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1">
          {project.techStack.map((tech) => (
            <Badge key={tech} variant="secondary" className="font-mono text-xs">
              {tech}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-2 pt-2">
          {project.link && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`link-project-demo-${project.id}`}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Demo
              </a>
            </Button>
          )}
          {project.github && (
            <Button variant="ghost" size="sm" asChild>
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`link-project-github-${project.id}`}
              >
                <Github className="h-4 w-4 mr-1" />
                Code
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
