import { StatsSection } from '../organisms/StatsSection';

export default function StatsSectionExample() {
  const stats = [
    { value: '50+', label: 'Projects' },
    { value: '10K+', label: 'Blog Readers' },
    { value: '500+', label: 'GitHub Stars' },
    { value: '5+', label: 'Years Exp.' },
  ];

  return <StatsSection stats={stats} />;
}
