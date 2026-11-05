import {
  useState,
  useTransition,
  type Dispatch,
  type SetStateAction,
} from 'react';
import {
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { moveTask, reorderPanels } from '@/app/(app)/dashboard/actions';
import { findPanelByTaskId, moveTaskToPanel } from '@/lib/boardMoves';
import type { BoardPanel, BoardTask } from '@/types/board';

const DRAG_ACTIVATION_DISTANCE = 5;

export function useBoardDrag(
  panels: BoardPanel[],
  setPanels: Dispatch<SetStateAction<BoardPanel[]>>
) {
  const [activeTask, setActiveTask] = useState<BoardTask | null>(null);
  const [, startTransition] = useTransition();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: DRAG_ACTIVATION_DISTANCE },
    })
  );

  function handleDragStart({ active }: DragStartEvent) {
    if (active.data.current?.type !== 'task') return;
    const panel = findPanelByTaskId(panels, String(active.id));
    setActiveTask(panel?.tasks.find((task) => task.id === active.id) ?? null);
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over || active.data.current?.type !== 'task') return;
    const activeRect = active.rect.current.translated;
    const isBelowOver =
      !!activeRect && activeRect.top > over.rect.top + over.rect.height / 2;
    setPanels((current) =>
      moveTaskToPanel(current, String(active.id), String(over.id), isBelowOver)
    );
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveTask(null);
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);

    if (active.data.current?.type === 'panel') {
      if (activeId === overId) return;
      const from = panels.findIndex((panel) => panel.id === activeId);
      const to = panels.findIndex((panel) => panel.id === overId);
      const reordered = arrayMove(panels, from, to);
      setPanels(reordered);
      startTransition(() => reorderPanels(reordered.map((panel) => panel.id)));
      return;
    }

    const panel = findPanelByTaskId(panels, activeId);
    if (!panel) return;
    const from = panel.tasks.findIndex((task) => task.id === activeId);
    const overIndex = panel.tasks.findIndex((task) => task.id === overId);
    const to = overIndex === -1 ? from : overIndex;
    const tasks = arrayMove(panel.tasks, from, to);
    setPanels((current) =>
      current.map((item) => (item.id === panel.id ? { ...item, tasks } : item))
    );
    startTransition(() => moveTask(activeId, panel.id, to));
  }

  return {
    sensors,
    activeTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
