import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import type { Project } from '@shared/schema';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { t } = useTranslation();

  return (
    <div
      className="group flex flex-col justify-between h-full rounded-xl border border-border/70 bg-card/60 p-5 sm:p-6 transition-colors hover:border-foreground/25 hover:bg-card @container"
      data-testid={`card-project-${project.id}`}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
            {project.title}
          </h3>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
          {project.description}
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center rounded-md bg-muted/70 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {(project.link || project.github) && (
          <div className="flex items-center gap-4 pt-3 border-t border-border/40 text-xs font-medium">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-foreground hover:text-primary transition-colors"
                data-testid={`link-project-demo-${project.id}`}
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                {t('work.viewProject')}
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                data-testid={`link-project-github-${project.id}`}
              >
                <SiGithub className="h-3.5 w-3.5" aria-hidden="true" />
                {t('work.viewCode')}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
