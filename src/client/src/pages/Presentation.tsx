import { Link, useRoute } from 'wouter';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, BookOpen, CheckCircle2, ChevronRight, MonitorPlay } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/atoms/SEO';
import { cn } from '@/lib/utils';
import { getPresentation, getPresentationAccent } from '@/content/presentations';

const accentClasses = {
  blue: {
    badge: 'border-primary/30 bg-primary/10 text-primary',
    glow: 'from-primary/15 via-transparent to-transparent',
    border: 'border-primary/25',
    text: 'text-primary',
  },
  teal: {
    badge: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    glow: 'from-emerald-500/15 via-transparent to-transparent',
    border: 'border-emerald-500/25',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  amber: {
    badge: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
    glow: 'from-amber-500/15 via-transparent to-transparent',
    border: 'border-amber-500/25',
    text: 'text-amber-600 dark:text-amber-400',
  },
};

export default function PresentationPage() {
  const { t, i18n } = useTranslation();
  const [, params] = useRoute('/presentations/:slug');
  const slug = params?.slug || '';
  const presentation = getPresentation(slug, i18n.language);
  const accent = accentClasses[getPresentationAccent(slug)];

  if (!presentation) {
    return (
      <article className="py-16">
        <div className="container-narrow max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <MonitorPlay className="h-8 w-8 mx-auto mb-3 text-muted-foreground" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-balance mb-3">{t('presentation.notFound')}</h1>
          <p className="text-sm text-muted-foreground text-pretty mb-6">{t('presentation.notFoundDescription')}</p>
          <Button asChild size="sm">
            <Link href="/blog">
              <ArrowLeft className="h-3.5 w-3.5 mr-2" aria-hidden="true" />
              {t('blog.backToBlog')}
            </Link>
          </Button>
        </div>
      </article>
    );
  }

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.feliperocha.systems';
  const presentationUrl = `${siteUrl}/presentations/${slug}`;
  const articlePath = `/blog/${presentation.articleSlug}`;

  return (
    <article className="py-10 md:py-14">
      <SEO
        title={presentation.title}
        description={presentation.subtitle}
        image="/assets/social-card-article.png"
        imageAlt={`${presentation.title} presentation by Felipe F. Rocha`}
        canonical={presentationUrl}
        author="Felipe F. Rocha"
      />

      <div className="container-default max-w-5xl mx-auto px-4 sm:px-6">
        <nav className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground transition-colors">
            {t('nav.home')}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <Link href="/blog" className="hover:text-foreground transition-colors">
            {t('nav.blog')}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="text-foreground truncate">{presentation.title}</span>
        </nav>

        <section className="relative overflow-hidden rounded-xl border border-border/70 bg-card/60 px-6 py-8 md:px-10 md:py-12">
          <div className={cn('absolute inset-0 bg-gradient-to-br opacity-80', accent.glow)} aria-hidden="true" />
          <div className="relative">
            <Badge variant="outline" className={cn('mb-5 font-mono text-xs', accent.badge)}>
              {presentation.kicker}
            </Badge>
            <div className="grid gap-8 lg:grid-cols-[1.4fr_.8fr] lg:items-end">
              <div>
                <h1 className="text-h1 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-balance mb-4">
                  {presentation.title}
                </h1>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-pretty max-w-2xl">
                  {presentation.subtitle}
                </p>
              </div>
              <div className="flex flex-col gap-2.5 sm:flex-row lg:flex-col">
                <Button asChild>
                  <a href="#presentation-sections">
                    <MonitorPlay className="h-4 w-4 mr-2" aria-hidden="true" />
                    {t('presentation.start')}
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <Link href={articlePath}>
                    <BookOpen className="h-4 w-4 mr-2" aria-hidden="true" />
                    {t('presentation.readArticle')}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3 my-8" aria-label={t('presentation.keyMetrics')}>
          {presentation.metrics.map((metric) => (
            <div key={metric.label} className={cn('rounded-xl border bg-card/40 p-5', accent.border)}>
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">{metric.label}</p>
              <p className={cn('text-2xl sm:text-3xl font-bold tracking-tight mb-1.5', accent.text)}>{metric.value}</p>
              <p className="text-sm text-muted-foreground leading-relaxed text-pretty">{metric.note}</p>
            </div>
          ))}
        </section>

        <section id="presentation-sections" className="space-y-5 scroll-mt-20">
          {presentation.sections.map((section, index) => (
            <div
              key={section.eyebrow}
              className="grid gap-6 rounded-xl border border-border/70 bg-card/50 p-6 md:grid-cols-[160px_1fr] md:p-8"
            >
              <div>
                <p className={cn('font-mono text-xs uppercase tracking-wider', accent.text)}>{section.eyebrow}</p>
                <p className="mt-2 font-mono text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, '0')}
                </p>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-balance mb-3">{section.title}</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-pretty mb-5 max-w-[65ch]">
                  {section.body}
                </p>
                <div className="grid gap-3 md:grid-cols-3">
                  {section.points.map((point) => (
                    <div key={point} className="flex gap-2.5 rounded-lg border border-border/60 bg-background/60 p-3.5">
                      <CheckCircle2 className={cn('h-4 w-4 flex-none mt-0.5', accent.text)} aria-hidden="true" />
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-pretty">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="my-8 rounded-xl border border-border/70 bg-muted/40 p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-balance mb-2">{presentation.actionTitle}</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-pretty max-w-2xl">
                {presentation.actionBody}
              </p>
            </div>
            <Button asChild>
              <Link href={articlePath}>
                <BookOpen className="h-4 w-4 mr-2" aria-hidden="true" />
                {t('presentation.readArticle')}
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </article>
  );
}
