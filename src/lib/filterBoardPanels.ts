import type { BoardPanel } from '@/types/board';

interface BoardFilter {
  memberId: string | null;
  labelId: string | null;
}

export function filterBoardPanels(
  panels: BoardPanel[],
  { memberId, labelId }: BoardFilter
): BoardPanel[] {
  if (!memberId && !labelId) return panels;
  return panels.map((panel) => ({
    ...panel,
    tasks: panel.tasks.filter(
      (task) =>
        (!memberId || task.memberIds.includes(memberId)) &&
        (!labelId || task.labelIds.includes(labelId))
    ),
  }));
}
