import { useRef, useState, type Dispatch, type SetStateAction } from 'react';
import {
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { moveTask, reorderPanels } from '@/app/(app)/dashboard/actions';
import { useSafeTransition } from '@/hooks/useSafeTransition';
import { findPanelByTaskId, moveTaskToPanel } from '@/lib/boardMoves';
import type { BoardPanel, BoardTask } from '@/types/board';

const DRAG_ACTIVATION_DISTANCE = 5;
const TOUCH_ACTIVATION_DELAY = 200;
const TOUCH_ACTIVATION_TOLERANCE = 5;

interface DragOrigin {
  id: string;
  type: 'task' | 'panel';
  panelId: string;
  index: number;
}

function insertAt<T>(items: T[], index: number, item: T) {
  const copy = [...items];
  copy.splice(index, 0, item);
  return copy;
}

function restoreOrigin(panels: BoardPanel[], origin: DragOrigin) {
  if (origin.type === 'panel') {
    const panel = panels.find((item) => item.id === origin.id);
    if (!panel) return panels;
    const others = panels.filter((item) => item.id !== origin.id);
    return insertAt(others, origin.index, panel);
  }
  const holder = findPanelByTaskId(panels, origin.id);
  const task = holder?.tasks.find((item) => item.id === origin.id);
  if (!task || holder?.id === origin.panelId) return panels;
  if (!panels.some((panel) => panel.id === origin.panelId)) {
    return panels;
  }
  return panels
    .map((panel) =>
      panel.id === holder?.id
        ? { ...panel, tasks: panel.tasks.filter((item) => item !== task) }
        : panel
    )
    .map((panel) =>
      panel.id === origin.panelId
        ? { ...panel, tasks: insertAt(panel.tasks, origin.index, task) }
        : panel
    );
}

export function useBoardDrag(
  panels: BoardPanel[],
  setPanels: Dispatch<SetStateAction<BoardPanel[]>>,
  isDisabled: boolean
) {
  const [activeTask, setActiveTask] = useState<BoardTask | null>(null);
  const savedPanels = useRef(panels);
  const dragOrigin = useRef<DragOrigin | null>(null);
  const pendingMoveCount = useRef(0);
  const { runAction } = useSafeTransition();
  const keyboardSensor = useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  });
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: isDisabled ? Infinity : DRAG_ACTIVATION_DISTANCE,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: isDisabled
        ? { distance: Infinity }
        : {
            delay: TOUCH_ACTIVATION_DELAY,
            tolerance: TOUCH_ACTIVATION_TOLERANCE,
          },
    }),
    isDisabled ? null : keyboardSensor
  );

  function handleDragStart({ active }: DragStartEvent) {
    if (pendingMoveCount.current === 0) savedPanels.current = panels;
    const id = String(active.id);
    if (active.data.current?.type !== 'task') {
      dragOrigin.current = {
        id,
        type: 'panel',
        panelId: id,
        index: panels.findIndex((item) => item.id === id),
      };
      return;
    }
    const panel = findPanelByTaskId(panels, id);
    dragOrigin.current = {
      id,
      type: 'task',
      panelId: panel?.id ?? '',
      index: panel?.tasks.findIndex((task) => task.id === id) ?? -1,
    };
    setActiveTask(panel?.tasks.find((task) => task.id === id) ?? null);
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
    if (!over) {
      handleDragCancel();
      return;
    }
    const activeId = String(active.id);
    const overId = String(over.id);

    if (active.data.current?.type === 'panel') {
      if (activeId === overId || over.data.current?.type !== 'panel') return;
      const from = panels.findIndex((panel) => panel.id === activeId);
      const to = panels.findIndex((panel) => panel.id === overId);
      const reordered = arrayMove(panels, from, to);
      setPanels(reordered);
      saveMove(() => reorderPanels(reordered.map((panel) => panel.id)));
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
    saveMove(() => moveTask(activeId, panel.id, to));
  }

  function handleDragCancel() {
    setActiveTask(null);
    const origin = dragOrigin.current;
    if (origin) setPanels((current) => restoreOrigin(current, origin));
  }

  async function saveMove(action: () => Promise<unknown>) {
    pendingMoveCount.current += 1;
    await runAction(action, {
      onError: () => setPanels(savedPanels.current),
    });
    pendingMoveCount.current -= 1;
  }

  return {
    sensors,
    activeTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  };
}
