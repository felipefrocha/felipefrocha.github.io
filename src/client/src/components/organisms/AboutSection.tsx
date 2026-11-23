import { useTranslation } from 'react-i18next';
import { SkillTag } from '@/components/atoms/SkillTag';

interface AboutSectionProps {
  bio: string;
  skills: string[];
}

export function AboutSection({ bio, skills }: AboutSectionProps) {
  const { t } = useTranslation();

  return (
    <section
      className="section-spacing py-12 md:py-16 border-b border-border/50 defer-render"
      data-testid="section-about"
    >
      <div className="container-default max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="text-h2 text-2xl sm:text-3xl font-semibold tracking-tight text-balance mb-6">
          {t('sections.about')}
        </h2>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] items-start">
          <div className="prose-measure">
            <p className="text-base sm:text-lg leading-relaxed text-muted-foreground text-pretty">
              {bio}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
              {t('about.skills')}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <SkillTag key={skill} skill={skill} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
