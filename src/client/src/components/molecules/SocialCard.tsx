import { Button } from '@/components/ui/button';
import { SiGithub, SiInstagram } from 'react-icons/si';
import { FaLinkedin } from 'react-icons/fa6';
import { ExternalLink } from 'lucide-react';

interface SocialCardProps {
  platform: 'github' | 'linkedin' | 'instagram';
  handle: string;
  url: string;
  followers?: string;
}

const config = {
  github: { icon: SiGithub, label: 'GitHub' },
  linkedin: { icon: FaLinkedin, label: 'LinkedIn' },
  instagram: { icon: SiInstagram, label: 'Instagram' },
};

export function SocialCard({ platform, handle, url, followers }: SocialCardProps) {
  const { icon: Icon, label } = config[platform];

  return (
    <div
      className="group flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-card/50 px-4 py-3 transition-colors hover:border-foreground/25 hover:bg-card"
      data-testid={`card-social-${platform}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/70 text-foreground">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-sm leading-tight">{label}</p>
          <p className="text-xs text-muted-foreground font-mono truncate">
            @{handle}
            {followers ? ` · ${followers} followers` : ''}
          </p>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground" asChild>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit ${label} profile`}
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </Button>
    </div>
  );
}
