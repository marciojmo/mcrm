import { EyeIcon } from 'lucide-react';
import { LabelFilter } from '@/components/features/board/LabelFilter';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { BoardLabel } from '@/types/board';

interface BoardFiltersProps {
  isOnlyMine: boolean;
  onToggleOnlyMine: () => void;
  labels: BoardLabel[];
  selectedLabel: BoardLabel | null;
  onSelectLabel: (labelId: string | null) => void;
  isDragPaused: boolean;
  hasBackground: boolean;
}

export function BoardFilters({
  isOnlyMine,
  onToggleOnlyMine,
  labels,
  selectedLabel,
  onSelectLabel,
  isDragPaused,
  hasBackground,
}: BoardFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 px-4 pt-3">
      <div
        className={cn(
          'flex items-center gap-2',
          hasBackground && 'rounded-lg bg-background p-1'
        )}
      >
        <Button
          variant={isOnlyMine ? 'default' : 'outline'}
          size="sm"
          aria-pressed={isOnlyMine}
          onClick={onToggleOnlyMine}
        >
          <EyeIcon /> Minhas tarefas
        </Button>
        <LabelFilter
          labels={labels}
          selectedLabel={selectedLabel}
          onSelect={onSelectLabel}
        />
      </div>
      <p
        role="status"
        className={cn(
          'text-xs text-muted-foreground',
          hasBackground && isDragPaused && 'rounded-lg bg-background px-2 py-1'
        )}
      >
        {isDragPaused && 'Reordenar está pausado enquanto há filtro ativo'}
      </p>
    </div>
  );
}
