import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollIndicator } from '@/components/atoms/ScrollIndicator';

interface HeroSectionProps {
  headline: string;
  subheadline?: string;
}

export function HeroSection({ headline, subheadline }: HeroSectionProps) {
  const { t } = useTranslation();
  const words = headline.split(' ');

  return (
    <section
      className="relative py-16 sm:py-24 md:py-28 border-b border-border/50"
      data-testid="section-hero"
    >
      <div className="container-default max-w-5xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Systems Engineering &amp; AI Architecture
          </p>

          <motion.h1
            className="text-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-balance"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {words.map((word, index) => (
              <span key={index}>
                {index === 1 ? (
                  <span className="text-primary">{word}</span>
                ) : (
                  word
                )}
                {index < words.length - 1 ? ' ' : ''}
              </span>
            ))}
          </motion.h1>

          {subheadline && (
            <motion.p
              className="mt-5 text-body-lg text-base sm:text-lg text-muted-foreground max-w-2xl text-pretty leading-relaxed"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08, ease: 'easeOut' }}
            >
              {subheadline}
            </motion.p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="sm">
              <Link href="/blog">
                {t('nav.blog')}
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/portfolio">{t('nav.portfolio')}</Link>
            </Button>
          </div>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
