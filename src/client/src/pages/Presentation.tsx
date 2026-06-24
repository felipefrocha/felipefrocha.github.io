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
    glow: 'from-primary/20 via-transparent to-transparent',
    border: 'border-primary/30',
    text: 'text-primary',
  },
  teal: {
    badge: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    glow: 'from-emerald-500/20 via-transparent to-transparent',
    border: 'border-emerald-500/30',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  amber: {
    badge: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
    glow: 'from-amber-500/20 via-transparent to-transparent',
    border: 'border-amber-500/30',
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
      <article className="py-16 px-6 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <MonitorPlay className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">{t('presentation.notFound')}</h1>
          <p className="text-muted-foreground mb-6">{t('presentation.notFoundDescription')}</p>
          <Button asChild>
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4" />
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
    <article className="px-6 md:px-8">
      <SEO
        title={presentation.title}
        description={presentation.subtitle}
        canonical={presentationUrl}
        author="Felipe F. Rocha"
      />

      <div className="max-w-6xl mx-auto py-8 md:py-12">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground transition-colors">
            {t('nav.home')}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/blog" className="hover:text-foreground transition-colors">
            {t('nav.blog')}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground truncate">{presentation.title}</span>
        </nav>

        <section className="relative overflow-hidden border border-border bg-card px-6 py-10 md:px-10 md:py-14">
          <div className={cn('absolute inset-0 bg-gradient-to-br opacity-80', accent.glow)} aria-hidden="true" />
          <div className="relative">
            <Badge variant="outline" className={cn('mb-6 font-mono text-xs', accent.badge)}>
              {presentation.kicker}
            </Badge>
            <div className="grid gap-8 lg:grid-cols-[1.4fr_.8fr] lg:items-end">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                  {presentation.title}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">
                  {presentation.subtitle}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button asChild size="lg">
                  <a href="#presentation-sections">
                    <MonitorPlay className="h-4 w-4" />
                    {t('presentation.start')}
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href={articlePath}>
                    <BookOpen className="h-4 w-4" />
                    {t('presentation.readArticle')}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3 my-8 md:my-10" aria-label={t('presentation.keyMetrics')}>
          {presentation.metrics.map((metric) => (
            <div key={metric.label} className={cn('border bg-background p-5', accent.border)}>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">{metric.label}</p>
              <p className={cn('text-3xl font-bold tracking-tight mb-2', accent.text)}>{metric.value}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{metric.note}</p>
            </div>
          ))}
        </section>

        <section id="presentation-sections" className="space-y-6 scroll-mt-20">
          {presentation.sections.map((section, index) => (
            <div key={section.eyebrow} className="grid gap-6 border border-border bg-card p-6 md:grid-cols-[180px_1fr] md:p-8">
              <div>
                <p className={cn('font-mono text-xs uppercase tracking-wider', accent.text)}>{section.eyebrow}</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  {String(index + 1).padStart(2, '0')}
                </p>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">{section.body}</p>
                <div className="grid gap-3 md:grid-cols-3">
                  {section.points.map((point) => (
                    <div key={point} className="flex gap-3 border border-border bg-background p-4">
                      <CheckCircle2 className={cn('h-5 w-5 flex-none mt-0.5', accent.text)} />
                      <p className="text-sm text-muted-foreground leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="my-8 md:my-10 border border-border bg-foreground text-background p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">{presentation.actionTitle}</h2>
              <p className="text-background/75 leading-relaxed max-w-3xl">{presentation.actionBody}</p>
            </div>
            <Button asChild variant="secondary">
              <Link href={articlePath}>
                <BookOpen className="h-4 w-4" />
                {t('presentation.readArticle')}
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </article>
  );
}
