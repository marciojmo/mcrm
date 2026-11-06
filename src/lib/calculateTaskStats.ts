import {
  PENALTY_PER_OVERDUE_TASK,
  POINTS_PER_COMPLETED_TASK,
  POINTS_PER_OPEN_TASK,
} from '@/constants/score';
import type { TaskStats } from '@/types/home';

interface StatsTask {
  completedAt: Date | null;
  dueDate: Date | null;
}

export function calculateTaskStats(
  tasks: StatsTask[],
  today: string
): TaskStats {
  let overdueCount = 0;
  let openCount = 0;
  let completedCount = 0;
  for (const task of tasks) {
    if (task.completedAt) completedCount++;
    else if (task.dueDate && task.dueDate.toISOString().slice(0, 10) < today)
      overdueCount++;
    else openCount++;
  }
  const score =
    completedCount * POINTS_PER_COMPLETED_TASK +
    openCount * POINTS_PER_OPEN_TASK -
    overdueCount * PENALTY_PER_OVERDUE_TASK;
  return { overdueCount, openCount, completedCount, score };
}
