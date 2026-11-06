import {
  CalendarIcon,
  MessageSquareIcon,
  PaperclipIcon,
  SquareCheckIcon,
} from 'lucide-react';
import { forwardRef, type HTMLAttributes } from 'react';
import { TaskCheckbox } from '@/components/features/board/TaskCheckbox';
import { LabelChip } from '@/components/features/board/LabelChip';
import { UserAvatar } from '@/components/features/board/UserAvatar';
import { formatDueDate } from '@/lib/formatDueDate';
import { cn } from '@/lib/utils';
import type { BoardLabel, BoardTask, BoardUser } from '@/types/board';

interface TaskCardProps extends HTMLAttributes<HTMLDivElement> {
  task: BoardTask;
  users: BoardUser[];
  labels: BoardLabel[];
  isGhost?: boolean;
  isOverlay?: boolean;
  onToggleCompleted?: () => void;
}

export const TaskCard = forwardRef<HTMLDivElement, TaskCardProps>(
  function TaskCard(
    {
      task,
      users,
      labels,
      isGhost = false,
      isOverlay = false,
      onToggleCompleted,
      className,
      ...props
    },
    ref
  ) {
    const taskLabels = labels.filter((label) =>
      task.labelIds.includes(label.id)
    );
    const members = users.filter((user) => task.memberIds.includes(user.id));

    return (
      <div
        ref={ref}
        className={cn(
          'group/task flex items-start justify-between gap-2 rounded-lg bg-card p-3 text-sm shadow-sm ring-1 ring-foreground/10',
          isGhost && 'opacity-40',
          isOverlay && 'rotate-2 cursor-grabbing shadow-lg',
          className
        )}
        {...props}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {taskLabels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {taskLabels.map((label) => (
                <LabelChip key={label.id} label={label} isCompact />
              ))}
            </div>
          )}
          <div className="relative">
            {onToggleCompleted && (
              <TaskCheckbox
                isCompleted={task.isCompleted}
                onToggle={onToggleCompleted}
                className="absolute top-0.5 left-0"
              />
            )}
            <span
              className={cn(
                'block break-words transition-transform duration-300',
                onToggleCompleted && 'group-hover/task:translate-x-6',
                onToggleCompleted && task.isCompleted && 'translate-x-6'
              )}
            >
              {task.title}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {task.dueDate && (
              <span className="flex items-center gap-1">
                <CalendarIcon className="size-3" />
                {formatDueDate(task.dueDate)}
              </span>
            )}
            {task.checklistTotal > 0 && (
              <span className="flex items-center gap-1">
                <SquareCheckIcon className="size-3" />
                {task.checklistDone}/{task.checklistTotal}
              </span>
            )}
            {task.attachmentCount > 0 && (
              <span className="flex items-center gap-1">
                <PaperclipIcon className="size-3" />
                {task.attachmentCount}
              </span>
            )}
            {task.commentCount > 0 && (
              <span className="flex items-center gap-1">
                <MessageSquareIcon className="size-3" />
                {task.commentCount}
              </span>
            )}
          </div>
        </div>
        {members.length > 0 && (
          <div className="flex shrink-0 -space-x-1">
            {members.map((user) => (
              <UserAvatar key={user.id} user={user} />
            ))}
          </div>
        )}
      </div>
    );
  }
);
