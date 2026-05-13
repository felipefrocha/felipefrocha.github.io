import { useTranslation } from 'react-i18next';
import { SkillTag } from '@/components/atoms/SkillTag';

interface AboutSectionProps {
  bio: string;
  skills: string[];
}

export function AboutSection({ bio, skills }: AboutSectionProps) {
  const { t } = useTranslation();
  return (
    <section className="py-16 md:py-20 px-6 md:px-8" data-testid="section-about">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-8">
          {t('sections.about')}
        </h2>
        
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="prose prose-neutral dark:prose-invert max-w-prose">
            <p className="text-lg leading-relaxed text-muted-foreground">
              {bio}
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-4">{t('about.skills')}</h3>
            <div className="flex flex-wrap gap-2">
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
