import { ChevronDown } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export function ScrollIndicator() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
      animate={shouldReduceMotion ? undefined : { y: [0, 8, 0] }}
      transition={shouldReduceMotion ? undefined : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      aria-hidden="true"
      data-testid="scroll-indicator"
    >
      <ChevronDown className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
    </motion.div>
  );
}
