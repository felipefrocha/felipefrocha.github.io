import { useTranslation } from 'react-i18next';
import { SocialCard } from '@/components/molecules/SocialCard';
import type { SocialLink } from '@shared/schema';

interface ConnectSectionProps {
  socialLinks: SocialLink[];
}

export function ConnectSection({ socialLinks }: ConnectSectionProps) {
  const { t } = useTranslation();

  if (!socialLinks || socialLinks.length === 0) {
    return null;
  }

  return (
    <section
      className="section-spacing py-12 md:py-16 defer-render"
      data-testid="section-connect"
    >
      <div className="container-default max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="text-h2 text-2xl sm:text-3xl font-semibold tracking-tight text-balance mb-6">
          {t('sections.connect')}
        </h2>

        <div className="grid gap-3 sm:grid-cols-3">
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
