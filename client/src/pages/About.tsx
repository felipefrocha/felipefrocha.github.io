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
                          handle={link.handle}
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
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {profile.bio}
                </p>
                
                <h3 className="text-xl font-semibold mt-8 mb-4">My Journey: From Factory Floors to Global AI Strategy</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-2">The Foundation: Logic & Precision</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      My career didn't start in the cloud; it started on the factory floor. For over a decade, I worked in <strong>Industrial Automation</strong>, mastering the precision of PLCs, SCADA systems, and robotics for companies like <strong>Fiat</strong> and <strong>Schneider Electric</strong>. This period taught me that a "bug" in the real world has physical consequences. It instilled in me a disciplined, systems-thinking approach where reliability wasn't optional—it was critical.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2">The Pivot: Building the Digital Bridge</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Driven by a curiosity for broader systemic impact, I transitioned into <strong>Software Engineering</strong> and <strong>Systems Engineering</strong>. I moved from wiring circuits to wiring complex applications, working as a Full-Stack Developer with <strong>Java, Spring Boot, and React</strong>. I realized that writing code was powerful, but <em>shipping</em> it efficiently was the real bottleneck. This insight launched my deep dive into <strong>DevOps, SRE, and Cloud Architecture</strong>.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2">The Scale: Cloud Native & DevOps Mastery</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      At companies like <strong>Banco Inter</strong>, <strong>Queima Diária</strong>, and <strong>CI&T</strong>, I specialized in scaling infrastructure. I didn't just build systems; I engineered the platforms that allowed them to survive. I led the adoption of <strong>Infrastructure as Code (Terraform)</strong>, defined multi-region strategies, and built high-performance DevOps teams from the ground up. I learned to balance cost, performance, and the intricate "12 Factor" methodologies required for modern cloud-native applications.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2">The Present: Strategic Leadership & AI Innovation</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Today, as a <strong>Senior Manager and Tech Chapter Lead at BCG (Boston Consulting Group)</strong>, I operate at the frontier of technology. My focus has shifted from managing servers to managing vision. I lead diverse, global teams in building <strong>GenAI</strong> and <strong>LLM solutions</strong>, bridging the gap between complex technical possibilities and strategic business value. I am no longer just the engineer who solves the problem; I am the leader who defines how we solve it, empowering teams to innovate with confidence.
                    </p>
                  </div>
                </div>
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
                  <h3 className="font-medium">Senior Manager, Software Engineer</h3>
                  <p className="text-sm text-muted-foreground">BCG-Global IT - Since 01/2025 </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Led a team in building strategic AI products and maintained platforms for Global IT Services.
                  </p>
                </div>

                <div className="border-l-2 border-muted pl-4">
                  <h3 className="font-medium">Senior AI Engineer</h3>
                  <p className="text-sm text-muted-foreground">BCG - 01/2024 to 01/2025 </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    GenAI application developer with OpenAI and Articul8; lead developer for offshore teams.
                  </p>
                </div>

                <div className="border-l-2 border-muted pl-4">
                  <h3 className="font-medium">Lead DevOps</h3>
                  <p className="text-sm text-muted-foreground">BCG - 11/2022 to 12/2023</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Built DevOps teams, defined interview processes, and led Case projects in Platform and DevOps subjects.
                  </p>
                </div>

                <div className="border-l-2 border-muted pl-4">
                  <h3 className="font-medium">Master SRE/DevOps</h3>
                  <p className="text-sm text-muted-foreground">CI&T - 08/2022 to 11/2022</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Defined IaC Architecture and multi-tenant/multi-region strategies.
                  </p>
                </div>

                <div className="border-l-2 border-muted pl-4">
                  <h3 className="font-medium">Senior SRE/DevOps</h3>
                  <p className="text-sm text-muted-foreground">CI&T - 02/2022 to 08/2022</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Managed AWS, cost optimization, HA configuration, and monitoring/observability.
                  </p>
                </div>

                <div className="border-l-2 border-muted pl-4">
                  <h3 className="font-medium">Cloud DevOps</h3>
                  <p className="text-sm text-muted-foreground">Queima Diaria - 08/2021 to 02/2022</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Built a DevOps team, mentored developers, and developed Platform Engineer Strategy (IDP).
                  </p>
                </div>

                <div className="border-l-2 border-muted pl-4">
                  <h3 className="font-medium">Cloud Architect</h3>
                  <p className="text-sm text-muted-foreground">Queima Diaria - 04/2021 to 08/2021</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Infrastructure as Code (Terraform), 12 Factor applications, and CI/CD pipelines with Github Actions.
                  </p>
                </div>

                <div className="border-l-2 border-muted pl-4">
                  <h3 className="font-medium">Cloud SRE</h3>
                  <p className="text-sm text-muted-foreground">Banco Inter - 01/2021 to 04/2021</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Infrastructure as Code, systems reliability, and cluster administration.
                  </p>
                </div>

                <div className="border-l-2 border-muted pl-4">
                  <h3 className="font-medium">Junior Solutions Architect</h3>
                  <p className="text-sm text-muted-foreground">DIT Digital - 01/2020 to 01/2021</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Project definitions, technology evaluation, and AWS/Azure solution definition.
                  </p>
                </div>

                <div className="border-l-2 border-muted pl-4">
                  <h3 className="font-medium">Software Developer Analyst</h3>
                  <p className="text-sm text-muted-foreground">DIT Digital - 04/2019 to 01/2020</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Angular/React front-end development and Spring Boot/.NET Core back-end development.
                  </p>
                </div>

                <div className="border-l-2 border-muted pl-4">
                  <h3 className="font-medium">Full-Stack Developer Jr.</h3>
                  <p className="text-sm text-muted-foreground">Strider Ag. - 12/2018 to 04/2019</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    React.js/Angular front-end, Spring Boot/JavaEE back-end, and mobile development.
                  </p>
                </div>

                <div className="border-l-2 border-muted pl-4">
                  <h3 className="font-medium">Application Technician Pl</h3>
                  <p className="text-sm text-muted-foreground">Schneider Electric - 02/2018 to 12/2018</p>
                </div>

                <div className="border-l-2 border-muted pl-4">
                  <h3 className="font-medium">Technical Coordinator</h3>
                  <p className="text-sm text-muted-foreground">Solution Automation Engineering - 06/2016 to 01/2018</p>
                </div>

                <div className="border-l-2 border-muted pl-4">
                  <h3 className="font-medium">Automation Technician Pl</h3>
                  <p className="text-sm text-muted-foreground">Solution Automation Engineering - 05/2015 to 06/2016</p>
                </div>

                <div className="border-l-2 border-muted pl-4">
                  <h3 className="font-medium">Automation Technician II</h3>
                  <p className="text-sm text-muted-foreground">FGL Controls and Automation - 07/2012 to 05/2015</p>
                </div>

                <div className="border-l-2 border-muted pl-4">
                  <h3 className="font-medium">Trainee</h3>
                  <p className="text-sm text-muted-foreground">Fiat Auto - 03/2010 to 03/2011</p>
                </div>

                <div className="border-l-2 border-muted pl-4">
                  <h3 className="font-medium">Instrumentation Technician</h3>
                  <p className="text-sm text-muted-foreground">W. Bachur Industrial Automation - 08/2007 to 06/2008 </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </article>
  );
}
