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
    <div className="flex flex-col items-center gap-3 p-4" data-testid="profile-card">
      <Avatar className="h-16 w-16">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback className="text-lg font-semibold">{initials}</AvatarFallback>
      </Avatar>
      <div className="text-center">
        <h2 className="text-lg font-semibold" data-testid="text-profile-name">{name}</h2>
        <p className="text-sm text-muted-foreground" data-testid="text-profile-tagline">{tagline}</p>
      </div>
    </div>
  );
}
