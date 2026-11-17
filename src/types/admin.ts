import type { TaskStats } from '@/types/home';

export interface CollaboratorSummary {
  id: string;
  name: string;
  email: string;
  image: string | null;
  stats: TaskStats;
  lastSeenAt: string | null;
}

export interface CollaboratorTask {
  id: string;
  title: string;
  boardName: string;
  panelName: string;
  dueDate: string | null;
  completedAt: string | null;
}

export interface CollaboratorBoard {
  id: string;
  name: string;
  stats: TaskStats;
}

export interface CollaboratorReport extends CollaboratorSummary {
  joinedAt: string;
  completedLast30Days: number;
  commentsLast30Days: number;
  boards: CollaboratorBoard[];
  openTasks: CollaboratorTask[];
  recentlyCompleted: CollaboratorTask[];
}
