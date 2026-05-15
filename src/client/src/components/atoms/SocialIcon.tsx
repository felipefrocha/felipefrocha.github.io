import { SiGithub, SiLinkedin, SiInstagram, SiX } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface SocialIconProps {
  platform: 'github' | 'linkedin' | 'instagram';
  url?: string;
  handle?: string;
  size?: 'sm' | 'default';
}

const icons = {
  github: SiGithub,
  linkedin: SiLinkedin,
  instagram: SiInstagram,
};

const labels = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
};

const getProfileUrl = (platform: 'github' | 'linkedin' | 'instagram', handle?: string, url?: string): string => {
  // If handle is provided, construct the full profile URL
  if (handle) {
    switch (platform) {
      case 'github':
        return `https://github.com/${handle}`;
      case 'linkedin':
        return `https://linkedin.com/in/${handle}`;
      case 'instagram':
        return `https://instagram.com/${handle}`;
    }
  }
  // Fallback to provided URL if no handle
  return url || '#';
};

export function SocialIcon({ platform, url, handle, size = 'default' }: SocialIconProps) {
  const Icon = icons[platform];
  const label = labels[platform];
  const profileUrl = getProfileUrl(platform, handle, url);

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
            href={profileUrl}
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
