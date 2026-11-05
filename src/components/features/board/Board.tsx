'use client';

import { useState } from 'react';
import { closestCorners, DndContext, DragOverlay } from '@dnd-kit/core';
import {
  horizontalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
import { createPanel } from '@/app/(app)/dashboard/actions';
import { PanelColumn } from '@/components/features/board/PanelColumn';
import { TaskDialog } from '@/components/features/board/TaskDialog';
import { TaskCard } from '@/components/features/board/TaskCard';
import { AddTextForm } from '@/components/ui/AddTextForm';
import { useBoardDrag } from '@/hooks/useBoardDrag';
import type { BoardLabel, BoardPanel, BoardUser } from '@/types/board';

interface BoardProps {
  panels: BoardPanel[];
  users: BoardUser[];
  labels: BoardLabel[];
  currentUserId: string;
}

export function Board({
  panels: serverPanels,
  users,
  labels,
  currentUserId,
}: BoardProps) {
  const [panels, setPanels] = useState(serverPanels);
  const [syncedPanels, setSyncedPanels] = useState(serverPanels);
  if (serverPanels !== syncedPanels) {
    setSyncedPanels(serverPanels);
    setPanels(serverPanels);
  }
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const openTask = panels
    .flatMap((panel) => panel.tasks)
    .find((task) => task.id === openTaskId);
  const {
    sensors,
    activeTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useBoardDrag(panels, setPanels);

  return (
    <DndContext
      id="board"
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-1 items-start gap-3 overflow-x-auto p-4">
        <SortableContext
          items={panels.map((panel) => panel.id)}
          strategy={horizontalListSortingStrategy}
        >
          {panels.map((panel) => (
            <PanelColumn
              key={panel.id}
              panel={panel}
              users={users}
              labels={labels}
              onOpenTask={setOpenTaskId}
            />
          ))}
        </SortableContext>
        <div className="w-72 shrink-0 rounded-xl bg-muted/60 p-2">
          <AddTextForm
            addLabel="Adicionar painel"
            placeholder="Nome do painel"
            onSubmit={createPanel}
          />
        </div>
      </div>
      <DragOverlay>
        {activeTask && (
          <TaskCard task={activeTask} users={users} labels={labels} isOverlay />
        )}
      </DragOverlay>
      {openTask && (
        <TaskDialog
          key={openTask.id}
          task={openTask}
          users={users}
          labels={labels}
          currentUserId={currentUserId}
          onClose={() => setOpenTaskId(null)}
        />
      )}
    </DndContext>
  );
}
