import { XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BoardLabel } from '@/types/board';

interface LabelChipProps {
  label: BoardLabel;
  isCompact?: boolean;
  onRemove?: () => void;
}

export function LabelChip({
  label,
  isCompact = false,
  onRemove,
}: LabelChipProps) {
  return (
    <span
      style={{ backgroundColor: label.color }}
      title={isCompact ? label.name || label.color : undefined}
      role={isCompact ? 'img' : undefined}
      aria-label={isCompact ? label.name || label.color : undefined}
      className={cn(
        'max-w-full rounded px-2 text-xs font-medium text-black/80',
        onRemove ? 'inline-flex items-center gap-1' : 'inline-block truncate',
        isCompact ? 'min-h-2 min-w-10 py-0' : 'min-h-5 min-w-10 py-0.5'
      )}
    >
      {isCompact ? '' : <span className="truncate">{label.name}</span>}
      {onRemove && (
        <button
          type="button"
          aria-label={`Remover etiqueta ${label.name || label.color}`}
          className="shrink-0 rounded hover:bg-black/15"
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
        >
          <XIcon className="size-3" />
        </button>
      )}
    </span>
  );
}
