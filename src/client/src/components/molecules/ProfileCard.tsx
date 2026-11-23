import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileCardProps {
  name: string;
  tagline: string;
  avatar?: string;
}

export function ProfileCard({ name, tagline, avatar }: ProfileCardProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-3 px-2 py-2.5" data-testid="profile-card">
      <Avatar className="h-9 w-9 shrink-0 ring-1 ring-border/70">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback className="text-xs font-semibold">{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <h2 className="text-sm font-semibold tracking-tight truncate" data-testid="text-profile-name">
          {name}
        </h2>
        <p className="text-xs text-muted-foreground truncate" data-testid="text-profile-tagline">
          {tagline}
        </p>
      </div>
    </div>
  );
}
