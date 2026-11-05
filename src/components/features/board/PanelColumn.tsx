'use client';

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { createTask } from '@/app/(app)/dashboard/actions';
import { PanelHeader } from '@/components/features/board/PanelHeader';
import { SortableTask } from '@/components/features/board/SortableTask';
import { AddTextForm } from '@/components/ui/AddTextForm';
import { cn } from '@/lib/utils';
import type { BoardLabel, BoardPanel, BoardUser } from '@/types/board';

interface PanelColumnProps {
  panel: BoardPanel;
  users: BoardUser[];
  labels: BoardLabel[];
  onOpenTask: (taskId: string) => void;
}

export function PanelColumn({
  panel,
  users,
  labels,
  onOpenTask,
}: PanelColumnProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: panel.id, data: { type: 'panel' } });

  return (
    <section
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'flex max-h-full w-72 shrink-0 flex-col gap-2 rounded-xl bg-muted p-2',
        isDragging && 'opacity-50'
      )}
    >
      <PanelHeader panel={panel} dragProps={{ ...attributes, ...listeners }} />
      <div className="flex min-h-2 flex-col gap-2 overflow-y-auto">
        <SortableContext
          items={panel.tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {panel.tasks.map((task) => (
            <SortableTask
              key={task.id}
              task={task}
              users={users}
              labels={labels}
              onOpen={() => onOpenTask(task.id)}
            />
          ))}
        </SortableContext>
      </div>
      <AddTextForm
        addLabel="Adicionar tarefa"
        placeholder="Título da tarefa"
        onSubmit={(title) => createTask(panel.id, title)}
      />
    </section>
  );
}
