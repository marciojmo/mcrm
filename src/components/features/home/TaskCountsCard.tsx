import {
  CircleCheckIcon,
  CircleDashedIcon,
  TriangleAlertIcon,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TaskStats } from '@/types/home';

interface CountProps {
  icon: LucideIcon;
  value: number;
  label: string;
  className?: string;
}

function Count({ icon: Icon, value, label, className }: CountProps) {
  return (
    <div className="flex flex-col gap-1">
      <Icon className={cn('size-4', className)} />
      <p className="text-3xl font-semibold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export function TaskCountsCard({ stats }: { stats: TaskStats }) {
  return (
    <div className="flex gap-6 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
      <Count
        icon={TriangleAlertIcon}
        value={stats.overdueCount}
        label="Em atraso"
        className="text-destructive"
      />
      <Count
        icon={CircleDashedIcon}
        value={stats.openCount}
        label="Em aberto"
        className="text-amber-500"
      />
      <Count
        icon={CircleCheckIcon}
        value={stats.completedCount}
        label="Concluídas"
        className="text-green-600"
      />
    </div>
  );
}
