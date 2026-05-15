interface StatNumberProps {
  value: string | number;
  label: string;
}

export function StatNumber({ value, label }: StatNumberProps) {
  return (
    <div className="text-center" data-testid={`stat-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <p className="text-4xl font-bold tracking-tight">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
