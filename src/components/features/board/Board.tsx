'use client';

import { useState } from 'react';
import { EyeIcon, SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { closestCorners, DndContext, DragOverlay } from '@dnd-kit/core';
import {
  horizontalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
import { createPanel } from '@/app/(app)/dashboard/actions';
import { BoardBreadcrumb } from '@/components/features/board/BoardBreadcrumb';
import { PanelColumn } from '@/components/features/board/PanelColumn';
import { TaskDialog } from '@/components/features/board/TaskDialog';
import { TaskCard } from '@/components/features/board/TaskCard';
import { AddTextForm } from '@/components/ui/AddTextForm';
import { Button, buttonVariants } from '@/components/ui/Button';
import { useBoardDrag } from '@/hooks/useBoardDrag';
import type { BoardLabel, BoardPanel, BoardUser } from '@/types/board';

interface BoardProps {
  boardId: string;
  boardName: string;
  panels: BoardPanel[];
  users: BoardUser[];
  labels: BoardLabel[];
  currentUserId: string;
  initialTaskId: string | null;
  highlightCommentId: string | null;
}

export function Board({
  boardId,
  boardName,
  panels: serverPanels,
  users,
  labels,
  currentUserId,
  initialTaskId,
  highlightCommentId,
}: BoardProps) {
  const [panels, setPanels] = useState(serverPanels);
  const [syncedPanels, setSyncedPanels] = useState(serverPanels);
  if (serverPanels !== syncedPanels) {
    setSyncedPanels(serverPanels);
    setPanels(serverPanels);
  }
  const { bfcacheId } = useRouter();
  const [isOnlyMine, setIsOnlyMine] = useState(false);
  const [openTaskId, setOpenTaskId] = useState(initialTaskId);
  const [syncedBfcacheId, setSyncedBfcacheId] = useState(bfcacheId);
  if (bfcacheId !== syncedBfcacheId) {
    setSyncedBfcacheId(bfcacheId);
    setOpenTaskId(initialTaskId);
  }
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

  const visiblePanels = isOnlyMine
    ? panels.map((panel) => ({
        ...panel,
        tasks: panel.tasks.filter((task) =>
          task.memberIds.includes(currentUserId)
        ),
      }))
    : panels;

  return (
    <DndContext
      id="board"
      sensors={isOnlyMine ? [] : sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex items-center gap-4 px-4 pt-4">
        <BoardBreadcrumb boardId={boardId} boardName={boardName} />
        <Button
          variant={isOnlyMine ? 'default' : 'outline'}
          size="sm"
          aria-pressed={isOnlyMine}
          onClick={() => setIsOnlyMine((current) => !current)}
        >
          <EyeIcon /> Minhas tarefas
        </Button>
        <Link
          href={`/dashboard/${boardId}/settings`}
          aria-label="Configurações"
          className={buttonVariants({ variant: 'outline', size: 'icon-sm' })}
        >
          <SettingsIcon />
        </Link>
      </div>
      <div className="flex flex-1 items-start gap-3 overflow-x-auto p-4">
        <SortableContext
          items={panels.map((panel) => panel.id)}
          strategy={horizontalListSortingStrategy}
        >
          {visiblePanels.map((panel) => (
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
            onSubmit={(name) => createPanel(boardId, name)}
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
          highlightCommentId={highlightCommentId}
          onClose={() => setOpenTaskId(null)}
        />
      )}
    </DndContext>
  );
}
