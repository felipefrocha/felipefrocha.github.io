import { StatNumber } from '@/components/atoms/StatNumber';

interface Stat {
  value: string | number;
  label: string;
}

interface StatsSectionProps {
  stats: Stat[];
}

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section className="py-16 md:py-20 px-6 md:px-8 bg-muted/30" data-testid="section-stats">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <StatNumber key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
