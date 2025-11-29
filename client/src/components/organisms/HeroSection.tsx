import { motion } from 'framer-motion';
import { ScrollIndicator } from '@/components/atoms/ScrollIndicator';

interface HeroSectionProps {
  headline: string;
  subheadline?: string;
}

export function HeroSection({ headline, subheadline }: HeroSectionProps) {
  const words = headline.split(' ');

  return (
    <section 
      className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 md:px-8"
      data-testid="section-hero"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
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
            className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {subheadline}
          </motion.p>
        )}
      </div>
      
      <ScrollIndicator />
    </section>
  );
}
