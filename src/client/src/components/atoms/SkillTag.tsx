import { Badge } from '@/components/ui/badge';

interface SkillTagProps {
  skill: string;
  variant?: 'default' | 'secondary' | 'outline';
}

export function SkillTag({ skill, variant = 'secondary' }: SkillTagProps) {
  return (
    <Badge 
      variant={variant} 
      className="font-mono text-xs"
      data-testid={`badge-skill-${skill.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {skill}
    </Badge>
  );
}
