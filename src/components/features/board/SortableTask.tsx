'use client';

import { useDndContext } from '@dnd-kit/core';
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
  const { active } = useDndContext();
  const isPanelDragging = active?.data.current?.type === 'panel';
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: 'task', name: task.title },
    disabled: { draggable: false, droppable: isPanelDragging },
  });
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
      className="cursor-grab touch-none outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === 'Enter' && !isDragging) return onOpen();
        listeners?.onKeyDown?.(event);
      }}
    />
  );
}
