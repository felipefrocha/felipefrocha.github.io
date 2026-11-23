import { StatNumber } from '@/components/atoms/StatNumber';

interface Stat {
  value: string | number;
  label: string;
}

interface StatsSectionProps {
  stats: Stat[];
}

export function StatsSection({ stats }: StatsSectionProps) {
  if (!stats || !Array.isArray(stats) || stats.length === 0) {
    return null;
  }

  return (
    <section
      className="section-spacing py-12 md:py-14 border-b border-border/50 defer-render"
      data-testid="section-stats"
    >
      <div className="container-default max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <StatNumber key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
