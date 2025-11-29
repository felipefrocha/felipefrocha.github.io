import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

export function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      data-testid="scroll-indicator"
    >
      <ChevronDown className="h-6 w-6 text-muted-foreground" />
    </motion.div>
  );
}
