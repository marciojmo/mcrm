import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  value: number;
  label: string;
  hint?: string;
  isHighlighted?: boolean;
}

export function StatCard({
  icon: Icon,
  value,
  label,
  hint,
  isHighlighted = false,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'flex min-w-40 flex-col gap-1 rounded-xl bg-card p-4 ring-1',
        isHighlighted ? 'ring-primary/40' : 'ring-foreground/10'
      )}
    >
      <Icon className="size-4 text-muted-foreground" />
      <p
        className={cn(
          'text-3xl font-semibold',
          value < 0 && 'text-destructive'
        )}
      >
        {value}
      </p>
      <p className="text-sm text-muted-foreground">{label}</p>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
