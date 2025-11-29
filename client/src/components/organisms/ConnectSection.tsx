import { SocialCard } from '@/components/molecules/SocialCard';
import type { SocialLink } from '@/types/blog';

interface ConnectSectionProps {
  socialLinks: SocialLink[];
}

export function ConnectSection({ socialLinks }: ConnectSectionProps) {
  return (
    <section className="py-16 md:py-20 px-6 md:px-8" data-testid="section-connect">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-8 text-center">
          Let's Connect
        </h2>
        
        <div className="grid gap-4 sm:grid-cols-2">
          {socialLinks.map((link) => (
            <SocialCard
              key={link.platform}
              platform={link.platform}
              handle={link.handle}
              url={link.url}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
