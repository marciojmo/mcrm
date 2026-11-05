'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskCard } from '@/components/features/board/TaskCard';
import type { BoardLabel, BoardTask, BoardUser } from '@/types/board';

interface SortableTaskProps {
  task: BoardTask;
  users: BoardUser[];
  labels: BoardLabel[];
  onOpen: () => void;
}

export function SortableTask({
  task,
  users,
  labels,
  onOpen,
}: SortableTaskProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: 'task' } });

  return (
    <TaskCard
      ref={setNodeRef}
      task={task}
      users={users}
      labels={labels}
      isGhost={isDragging}
      onClick={onOpen}
      className="cursor-grab touch-none"
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
    />
  );
}
