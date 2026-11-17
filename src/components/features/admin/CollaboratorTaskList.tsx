import { formatDueDate } from '@/lib/formatDueDate';
import { formatShortDate } from '@/lib/formatShortDate';
import { cn } from '@/lib/utils';
import type { CollaboratorTask } from '@/types/admin';

interface CollaboratorTaskListProps {
  title: string;
  tasks: CollaboratorTask[];
  today: string;
  emptyMessage: string;
}

export function CollaboratorTaskList({
  title,
  tasks,
  today,
  emptyMessage,
}: CollaboratorTaskListProps) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-medium">
        {title}{' '}
        <span className="text-muted-foreground tabular-nums">
          {tasks.length}
        </span>
      </h2>
      {tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <ul className="divide-y rounded-md border text-sm">
          {tasks.map((task) => {
            const isOverdue =
              !task.completedAt && !!task.dueDate && task.dueDate < today;
            return (
              <li key={task.id} className="flex items-center gap-3 px-3 py-2">
                <span className="min-w-0 flex-1 truncate">{task.title}</span>
                <span className="hidden truncate text-xs text-muted-foreground sm:block">
                  {task.boardName} · {task.panelName}
                </span>
                <span
                  className={cn(
                    'shrink-0 text-right text-xs whitespace-nowrap text-muted-foreground',
                    isOverdue && 'font-medium text-destructive'
                  )}
                >
                  {task.completedAt
                    ? formatShortDate(task.completedAt)
                    : task.dueDate
                      ? formatDueDate(task.dueDate)
                      : 'Sem prazo'}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
