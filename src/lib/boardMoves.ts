import type { BoardPanel } from '@/types/board';

export function findPanelByTaskId(panels: BoardPanel[], taskId: string) {
  return panels.find((panel) => panel.tasks.some((task) => task.id === taskId));
}

export function moveTaskToPanel(
  panels: BoardPanel[],
  taskId: string,
  overId: string,
  isBelowOver: boolean
) {
  const source = findPanelByTaskId(panels, taskId);
  const target =
    panels.find((panel) => panel.id === overId) ??
    findPanelByTaskId(panels, overId);
  if (!source || !target || source.id === target.id) return panels;

  const task = source.tasks.find((item) => item.id === taskId);
  if (!task) return panels;
  const overIndex = target.tasks.findIndex((item) => item.id === overId);
  const index =
    overIndex === -1 ? target.tasks.length : overIndex + (isBelowOver ? 1 : 0);

  return panels.map((panel) => {
    if (panel.id === source.id) {
      return { ...panel, tasks: panel.tasks.filter((t) => t.id !== taskId) };
    }
    if (panel.id !== target.id) return panel;
    const tasks = [...panel.tasks];
    tasks.splice(index, 0, task);
    return { ...panel, tasks };
  });
}
