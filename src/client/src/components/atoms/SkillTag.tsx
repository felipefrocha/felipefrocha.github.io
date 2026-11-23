import { Badge } from '@/components/ui/badge';

interface SkillTagProps {
  skill: string;
  variant?: 'default' | 'secondary' | 'outline';
}

export function SkillTag({ skill, variant = 'secondary' }: SkillTagProps) {
  return (
    <Badge
      variant={variant}
      className="font-mono text-[11px] font-normal px-2 py-0.5 text-muted-foreground bg-muted/60 border-border/60"
      data-testid={`badge-skill-${skill.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {skill}
    </Badge>
  );
}
