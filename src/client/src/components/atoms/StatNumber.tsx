interface StatNumberProps {
  value: string | number;
  label: string;
}

export function StatNumber({ value, label }: StatNumberProps) {
  return (
    <div className="text-center" data-testid={`stat-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <p className="text-3xl sm:text-4xl font-semibold tracking-tight tabular-nums text-foreground">{value}</p>
      <p className="text-xs sm:text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
