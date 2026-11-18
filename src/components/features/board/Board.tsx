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
import { LabelFilter } from '@/components/features/board/LabelFilter';
import { PanelColumn } from '@/components/features/board/PanelColumn';
import { TaskDialog } from '@/components/features/board/TaskDialog';
import { TaskCard } from '@/components/features/board/TaskCard';
import { AddTextForm } from '@/components/ui/AddTextForm';
import { Button, buttonVariants } from '@/components/ui/Button';
import {
  DRAG_ANNOUNCEMENTS,
  DRAG_INSTRUCTIONS,
  PAUSED_DRAG_INSTRUCTIONS,
} from '@/constants/dragAccessibility';
import { useBoardDrag } from '@/hooks/useBoardDrag';
import { filterBoardPanels } from '@/lib/filterBoardPanels';
import type { BoardLabel, BoardPanel, BoardUser } from '@/types/board';
import type { TaskReference } from '@/types/task';

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
  const router = useRouter();
  const { bfcacheId } = router;
  const [isOnlyMine, setIsOnlyMine] = useState(false);
  const [filterLabelId, setFilterLabelId] = useState<string | null>(null);
  const [openTaskId, setOpenTaskId] = useState(initialTaskId);
  const [syncedBfcacheId, setSyncedBfcacheId] = useState(bfcacheId);
  if (bfcacheId !== syncedBfcacheId) {
    setSyncedBfcacheId(bfcacheId);
    setOpenTaskId(initialTaskId);
  }
  const openTask = panels
    .flatMap((panel) => panel.tasks)
    .find((task) => task.id === openTaskId);
  function openTaskReference(reference: TaskReference) {
    if (reference.boardId === boardId) {
      setOpenTaskId(reference.taskId);
      return;
    }
    router.push(`/dashboard/${reference.boardId}?task=${reference.taskId}`);
  }
  const isDragPaused = isOnlyMine || filterLabelId !== null;
  const {
    sensors,
    activeTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useBoardDrag(panels, setPanels, isDragPaused);

  const visiblePanels = filterBoardPanels(panels, {
    memberId: isOnlyMine ? currentUserId : null,
    labelId: filterLabelId,
  });
  const boardLabels = labels.filter((label) =>
    panels.some((panel) =>
      panel.tasks.some((task) => task.labelIds.includes(label.id))
    )
  );

  return (
    <DndContext
      id="board"
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      accessibility={{
        announcements: DRAG_ANNOUNCEMENTS,
        screenReaderInstructions: isDragPaused
          ? PAUSED_DRAG_INSTRUCTIONS
          : DRAG_INSTRUCTIONS,
      }}
    >
      <div className="flex items-center justify-between gap-4 px-4 pt-4">
        <BoardBreadcrumb boardId={boardId} boardName={boardName} />
        <Link
          href={`/dashboard/${boardId}/settings`}
          aria-label="Configurações"
          className={buttonVariants({ variant: 'outline', size: 'icon-sm' })}
        >
          <SettingsIcon />
        </Link>
      </div>
      <div className="flex items-center gap-2 px-4 pt-3">
        <Button
          variant={isOnlyMine ? 'default' : 'outline'}
          size="sm"
          aria-pressed={isOnlyMine}
          onClick={() => setIsOnlyMine((current) => !current)}
        >
          <EyeIcon /> Minhas tarefas
        </Button>
        <LabelFilter
          labels={boardLabels}
          selectedLabel={
            labels.find((label) => label.id === filterLabelId) ?? null
          }
          onSelect={setFilterLabelId}
        />
        {isDragPaused && (
          <p role="status" className="text-xs text-muted-foreground">
            Reordenar está pausado enquanto há filtro ativo
          </p>
        )}
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
          onOpenTask={openTaskReference}
        />
      )}
    </DndContext>
  );
}
