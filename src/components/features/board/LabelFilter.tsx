import { TagIcon, XIcon } from 'lucide-react';
import { LabelChip } from '@/components/features/board/LabelChip';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import type { BoardLabel } from '@/types/board';

interface LabelFilterProps {
  labels: BoardLabel[];
  selectedLabel: BoardLabel | null;
  onSelect: (labelId: string | null) => void;
}

export function LabelFilter({
  labels,
  selectedLabel,
  onSelect,
}: LabelFilterProps) {
  return (
    <div className="flex items-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant={selectedLabel ? 'default' : 'outline'} size="sm" />
          }
        >
          <TagIcon />
          {selectedLabel ? (
            <LabelChip label={selectedLabel} />
          ) : (
            'Todas as etiquetas'
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem onClick={() => onSelect(null)}>
            Todas as etiquetas
          </DropdownMenuItem>
          {labels.length > 0 && <DropdownMenuSeparator />}
          {labels.map((label) => (
            <DropdownMenuItem key={label.id} onClick={() => onSelect(label.id)}>
              <LabelChip label={label} />
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {selectedLabel && (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Limpar filtro de etiqueta"
          onClick={() => onSelect(null)}
        >
          <XIcon />
        </Button>
      )}
    </div>
  );
}
