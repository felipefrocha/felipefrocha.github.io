import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { SkillTag } from '@/components/atoms/SkillTag';
import { SocialIcon } from '@/components/atoms/SocialIcon';
import { MapPin, Mail } from 'lucide-react';
import type { ProfileInfo, SocialLink } from '@/types/blog';

export default function About() {
  const { data: profile, isLoading: profileLoading } = useQuery<ProfileInfo>({
    queryKey: ['/api/profile'],
    staleTime: 5 * 60 * 1000,
  });

  const { data: skills } = useQuery<string[]>({
    queryKey: ['/api/skills'],
    staleTime: 5 * 60 * 1000,
  });

  const { data: socialLinks } = useQuery<SocialLink[]>({
    queryKey: ['/api/socials'],
    staleTime: 5 * 60 * 1000,
  });

  if (profileLoading || !profile) {
    return (
      <article className="py-8 md:py-12 px-6 md:px-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-40 mb-12" />
          <div className="grid gap-12 lg:grid-cols-3">
            <Skeleton className="h-64" />
            <div className="lg:col-span-2 space-y-8">
              <Skeleton className="h-32" />
              <Skeleton className="h-24" />
            </div>
          </div>
        </div>
      </article>
    );
  }

  const initials = profile.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <article className="py-8 md:py-12 px-6 md:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4" data-testid="text-about-title">
            About Me
          </h1>
        </header>

        <div className="grid gap-12 lg:grid-cols-3">
          <aside className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback className="text-2xl font-semibold">{initials}</AvatarFallback>
                  </Avatar>
                  
                  <h2 className="text-xl font-semibold" data-testid="text-about-name">
                    {profile.name}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    {profile.tagline}
                  </p>

                  {profile.location && (
                    <p className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </p>
                  )}
                  
                  {profile.email && (
                    <p className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                      <Mail className="h-4 w-4" />
                      {profile.email}
                    </p>
                  )}

                  {socialLinks && (
                    <div className="flex items-center gap-1">
                      {socialLinks.map((link) => (
                        <SocialIcon
                          key={link.platform}
                          platform={link.platform}
                          url={link.url}
                          size="sm"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </aside>

          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Background</h2>
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  {profile.bio}
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  I believe in writing clean, maintainable code and creating intuitive user experiences. 
                  My approach combines technical expertise with a deep understanding of user needs, 
                  resulting in products that are both powerful and delightful to use.
                </p>
              </div>
            </section>

            {skills && skills.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-4">Skills & Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <SkillTag key={skill} skill={skill} />
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-2xl font-semibold mb-4">Experience</h2>
              <div className="space-y-6">
                <div className="border-l-2 border-primary pl-4">
                  <h3 className="font-medium">Senior Software Engineer</h3>
                  <p className="text-sm text-muted-foreground">Tech Company - 2022 to Present</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Leading frontend development and mentoring junior developers.
                  </p>
                </div>
                <div className="border-l-2 border-muted pl-4">
                  <h3 className="font-medium">Software Engineer</h3>
                  <p className="text-sm text-muted-foreground">Startup Inc - 2020 to 2022</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Full-stack development with React and Node.js.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </article>
  );
}
