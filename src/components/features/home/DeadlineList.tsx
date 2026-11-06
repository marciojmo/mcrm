import Link from 'next/link';
import { formatDueDate } from '@/lib/formatDueDate';
import { cn } from '@/lib/utils';
import type { HomeDeadline } from '@/types/home';

interface DeadlineListProps {
  deadlines: HomeDeadline[];
  today: string;
}

export function DeadlineList({ deadlines, today }: DeadlineListProps) {
  if (deadlines.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhuma tarefa pendente com prazo.
      </p>
    );
  }
  return (
    <ul className="flex max-w-xl flex-col gap-2">
      {deadlines.map((task) => (
        <li key={task.id}>
          <Link
            href={`/dashboard?task=${task.id}`}
            className="flex items-center justify-between gap-3 rounded-lg bg-card p-3 text-sm ring-1 ring-foreground/10 hover:bg-muted"
          >
            <span className="flex min-w-0 flex-col">
              <span className="truncate font-medium">{task.title}</span>
              <span className="text-xs text-muted-foreground">
                {task.panelName}
              </span>
            </span>
            <span
              className={cn(
                'shrink-0 text-xs',
                task.dueDate < today
                  ? 'font-medium text-destructive'
                  : 'text-muted-foreground'
              )}
            >
              {task.dueDate < today && 'Vencida · '}
              {formatDueDate(task.dueDate)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
