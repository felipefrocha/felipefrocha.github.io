import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SiGithub, SiLinkedin, SiInstagram, SiX } from 'react-icons/si';
import { ExternalLink } from 'lucide-react';

interface SocialCardProps {
  platform: 'github' | 'linkedin' | 'instagram' ;
  handle: string;
  url: string;
  followers?: string;
}

const config = {
  github: { icon: SiGithub, label: 'GitHub', color: 'hover:border-[#333] dark:hover:border-[#fff]' },
  linkedin: { icon: SiLinkedin, label: 'LinkedIn', color: 'hover:border-[#0A66C2]' },
  instagram: { icon: SiInstagram, label: 'Instagram', color: 'hover:border-[#E4405F]' },
};

export function SocialCard({ platform, handle, url, followers }: SocialCardProps) {
  const { icon: Icon, label, color } = config[platform];

  return (
    <Card 
      className={`transition-all hover-elevate ${color}`}
      data-testid={`card-social-${platform}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-muted">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-sm">{label}</p>
              <p className="text-xs text-muted-foreground">@{handle}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" asChild>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${label} profile`}
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
        {followers && (
          <p className="text-xs text-muted-foreground mt-3">{followers} followers</p>
        )}
      </CardContent>
    </Card>
  );
}
