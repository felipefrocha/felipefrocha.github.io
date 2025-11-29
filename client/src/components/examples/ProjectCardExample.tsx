import { ProjectCard } from '../molecules/ProjectCard';

export default function ProjectCardExample() {
  const project = {
    id: 'example-project',
    title: 'E-Commerce Platform',
    description: 'A modern e-commerce platform built with Next.js, featuring real-time inventory and secure payments.',
    techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe'],
    link: 'https://example.com',
    github: 'https://github.com',
  };

  return (
    <div className="max-w-sm">
      <ProjectCard project={project} />
    </div>
  );
}
