import { cn } from '@/lib/utils';
import type { BoardLabel } from '@/types/board';

interface LabelChipProps {
  label: BoardLabel;
  isCompact?: boolean;
}

export function LabelChip({ label, isCompact = false }: LabelChipProps) {
  return (
    <span
      style={{ backgroundColor: label.color }}
      className={cn(
        'inline-block max-w-full truncate rounded px-2 text-xs font-medium text-black/80',
        isCompact ? 'min-h-2 min-w-10 py-0' : 'min-h-5 min-w-10 py-0.5'
      )}
    >
      {isCompact ? '' : label.name}
    </span>
  );
}
