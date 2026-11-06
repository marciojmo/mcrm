import { CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCheckboxProps {
  isCompleted: boolean;
  isAlwaysVisible?: boolean;
  onToggle: () => void;
  className?: string;
}

export function TaskCheckbox({
  isCompleted,
  isAlwaysVisible = false,
  onToggle,
  className,
}: TaskCheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isCompleted}
      aria-label={isCompleted ? 'Reabrir tarefa' : 'Concluir tarefa'}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      className={cn(
        'flex size-4 shrink-0 items-center justify-center rounded-full border transition-all duration-500',
        isCompleted
          ? 'border-green-500 bg-green-500 text-white'
          : 'border-muted-foreground/60 hover:border-foreground',
        !isAlwaysVisible &&
          !isCompleted &&
          'opacity-0 group-hover/task:opacity-100 focus-visible:opacity-100',
        className
      )}
    >
      <CheckIcon
        className={cn(
          'size-3 transition-transform duration-300',
          isCompleted ? 'scale-100' : 'scale-0'
        )}
      />
    </button>
  );
}
