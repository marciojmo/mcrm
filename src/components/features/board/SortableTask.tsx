'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskCard } from '@/components/features/board/TaskCard';
import { useTaskCompletion } from '@/hooks/useTaskCompletion';
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
  const completion = useTaskCompletion(task.id, task.isCompleted);

  return (
    <TaskCard
      ref={setNodeRef}
      task={{ ...task, isCompleted: completion.isCompleted }}
      onToggleCompleted={completion.toggle}
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
