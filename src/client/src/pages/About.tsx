import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { SkillTag } from '@/components/atoms/SkillTag';
import { SocialIcon } from '@/components/atoms/SocialIcon';
import { SEO } from '@/components/atoms/SEO';
import { generatePersonSchema } from '@/lib/structuredData';
import { MapPin, Mail } from 'lucide-react';
import type { ProfileInfo, SocialLink } from '@shared/schema';
import { fetchProfile, fetchSkills, fetchSocials } from '@/lib/api';

const experienceItems = [
  {
    role: 'Senior Manager, Software Engineer',
    company: 'BCG-Global IT',
    period: 'Since 01/2025',
    current: true,
    description:
      'Led a team in building strategic AI products and maintained platforms for Global IT Services.',
  },
  {
    role: 'Senior AI Engineer',
    company: 'BCG',
    period: '01/2024 to 01/2025',
    description:
      'GenAI application developer with OpenAI and Articul8; lead developer for offshore teams.',
  },
  {
    role: 'Lead DevOps',
    company: 'BCG',
    period: '11/2022 to 12/2023',
    description:
      'Built DevOps teams, defined interview processes, and led Case projects in Platform and DevOps subjects.',
  },
  {
    role: 'Master SRE/DevOps',
    company: 'CI&T',
    period: '08/2022 to 11/2022',
    description: 'Defined IaC Architecture and multi-tenant/multi-region strategies.',
  },
  {
    role: 'Senior SRE/DevOps',
    company: 'CI&T',
    period: '02/2022 to 08/2022',
    description:
      'Managed AWS, cost optimization, HA configuration, and monitoring/observability.',
  },
  {
    role: 'Cloud DevOps',
    company: 'Queima Diaria',
    period: '08/2021 to 02/2022',
    description:
      'Built a DevOps team, mentored developers, and developed Platform Engineer Strategy (IDP).',
  },
  {
    role: 'Cloud Architect',
    company: 'Queima Diaria',
    period: '04/2021 to 08/2021',
    description:
      'Infrastructure as Code (Terraform), 12 Factor applications, and CI/CD pipelines with Github Actions.',
  },
  {
    role: 'Cloud SRE',
    company: 'Banco Inter',
    period: '01/2021 to 04/2021',
    description:
      'Infrastructure as Code, systems reliability, and cluster administration.',
  },
  {
    role: 'Junior Solutions Architect',
    company: 'DIT Digital',
    period: '01/2020 to 01/2021',
    description:
      'Project definitions, technology evaluation, and AWS/Azure solution definition.',
  },
  {
    role: 'Software Developer Analyst',
    company: 'DIT Digital',
    period: '04/2019 to 01/2020',
    description:
      'Angular/React front-end development and Spring Boot/.NET Core back-end development.',
  },
  {
    role: 'Full-Stack Developer Jr.',
    company: 'Strider Ag.',
    period: '12/2018 to 04/2019',
    description:
      'React.js/Angular front-end, Spring Boot/JavaEE back-end, and mobile development.',
  },
  {
    role: 'Application Technician Pl',
    company: 'Schneider Electric',
    period: '02/2018 to 12/2018',
  },
  {
    role: 'Technical Coordinator',
    company: 'Solution Automation Engineering',
    period: '06/2016 to 01/2018',
  },
  {
    role: 'Automation Technician Pl',
    company: 'Solution Automation Engineering',
    period: '05/2015 to 06/2016',
  },
  {
    role: 'Automation Technician II',
    company: 'FGL Controls and Automation',
    period: '07/2012 to 05/2015',
  },
  {
    role: 'Trainee',
    company: 'Fiat Auto',
    period: '03/2010 to 03/2011',
  },
  {
    role: 'Instrumentation Technician',
    company: 'W. Bachur Industrial Automation',
    period: '08/2007 to 06/2008',
  },
];

export default function About() {
  const { t } = useTranslation();
  const { data: profile, isLoading: profileLoading } = useQuery<ProfileInfo>({
    queryKey: ['/api/profile'],
    queryFn: fetchProfile,
    staleTime: 5 * 60 * 1000,
  });

  const { data: skills } = useQuery<string[]>({
    queryKey: ['/api/skills'],
    queryFn: fetchSkills,
    staleTime: 5 * 60 * 1000,
  });

  const { data: socialLinks } = useQuery<SocialLink[]>({
    queryKey: ['/api/socials'],
    queryFn: fetchSocials,
    staleTime: 5 * 60 * 1000,
  });

  if (profileLoading || !profile) {
    return (
      <article className="py-10 md:py-14">
        <div className="container-default max-w-5xl mx-auto px-4 sm:px-6">
          <Skeleton className="h-9 w-40 mb-10" />
          <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
            <Skeleton className="h-56 rounded-xl" />
            <div className="space-y-8">
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
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

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.feliperocha.systems';
  const aboutUrl = `${siteUrl}/about`;

  const journeyStages = [
    {
      title: t('about.journey.foundation.title'),
      content: t('about.journey.foundation.content'),
    },
    {
      title: t('about.journey.pivot.title'),
      content: t('about.journey.pivot.content'),
    },
    {
      title: t('about.journey.scale.title'),
      content: t('about.journey.scale.content'),
    },
    {
      title: t('about.journey.present.title'),
      content: t('about.journey.present.content'),
    },
  ];

  return (
    <article className="py-10 md:py-14">
      <SEO
        title="About"
        description={profile.bio}
        type="profile"
        canonical={aboutUrl}
        structuredData={generatePersonSchema(profile, socialLinks || [])}
      />
      <div className="container-default max-w-5xl mx-auto px-4 sm:px-6">
        <header className="mb-10">
          <h1
            className="text-h1 text-3xl sm:text-4xl font-bold tracking-tight"
            data-testid="text-about-title"
          >
            {t('about.title')}
          </h1>
        </header>

        <div className="grid gap-10 lg:grid-cols-[240px_1fr] items-start">
          <aside className="lg:sticky lg:top-20 rounded-xl border border-border/70 bg-card/60 p-5">
            <div className="flex flex-col items-start">
              <Avatar className="h-16 w-16 mb-3 ring-1 ring-border/70">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback className="text-lg font-semibold">{initials}</AvatarFallback>
              </Avatar>

              <h2 className="text-base font-semibold tracking-tight" data-testid="text-about-name">
                {profile.name}
              </h2>
              <p className="text-xs font-mono text-muted-foreground mb-4">
                {profile.tagline}
              </p>

              <div className="space-y-1.5 text-xs text-muted-foreground mb-4 w-full">
                {profile.location && (
                  <p className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{profile.location}</span>
                  </p>
                )}

                {profile.email && (
                  <p className="flex items-center gap-2 break-all">
                    <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{profile.email}</span>
                  </p>
                )}
              </div>

              {socialLinks && (
                <div className="flex items-center gap-0.5 -ml-2 pt-2 border-t border-border/50 w-full">
                  {socialLinks.map((link) => (
                    <SocialIcon
                      key={link.platform}
                      platform={link.platform}
                      handle={link.handle}
                      url={link.url}
                      size="sm"
                    />
                  ))}
                </div>
              )}
            </div>
          </aside>

          <div className="space-y-12 min-w-0">
            <section className="prose-measure max-w-[68ch]">
              <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
                {t('about.background')}
              </h2>
              <p className="text-base sm:text-lg text-foreground/90 leading-relaxed mb-8 text-pretty">
                {profile.bio}
              </p>

              <h3 className="text-lg font-semibold tracking-tight mb-5">
                {t('about.journey.title')}
              </h3>

              <div className="space-y-6">
                {journeyStages.map((stage) => (
                  <div key={stage.title} className="space-y-1.5">
                    <h4 className="text-sm font-semibold text-foreground">{stage.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
                      {stage.content}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {skills && skills.length > 0 && (
              <section className="pt-8 border-t border-border/60">
                <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-4">
                  {t('about.skills')}
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <SkillTag key={skill} skill={skill} />
                  ))}
                </div>
              </section>
            )}

            <section className="pt-8 border-t border-border/60 defer-render">
              <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-6">
                {t('about.experience')}
              </h2>
              <div className="divide-y divide-border/50">
                {experienceItems.map((item) => (
                  <div
                    key={`${item.role}-${item.period}`}
                    className="py-4 first:pt-0 last:pb-0 grid gap-1 sm:grid-cols-[180px_1fr] sm:gap-6 items-baseline"
                  >
                    <p className="text-xs font-mono text-muted-foreground">
                      {item.period}
                    </p>
                    <div>
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <h3 className="text-sm font-semibold text-foreground">
                          {item.role}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          · {item.company}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed text-pretty">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </article>
  );
}
