import { SiGithub, SiLinkedin, SiInstagram, SiX } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface SocialIconProps {
  platform: 'github' | 'linkedin' | 'instagram' | 'twitter';
  url: string;
  size?: 'sm' | 'default';
}

const icons = {
  github: SiGithub,
  linkedin: SiLinkedin,
  instagram: SiInstagram,
  twitter: SiX,
};

const labels = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  twitter: 'X (Twitter)',
};

export function SocialIcon({ platform, url, size = 'default' }: SocialIconProps) {
  const Icon = icons[platform];
  const label = labels[platform];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          asChild
          className={size === 'sm' ? 'h-8 w-8' : undefined}
          data-testid={`link-social-${platform}`}
        >
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${label} profile`}
          >
            <Icon className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />
          </a>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}
