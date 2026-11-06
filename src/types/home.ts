import type { BoardUser } from '@/types/board';

export type HomeView = 'overview' | 'notifications' | 'deadlines';

export interface HomeDeadline {
  id: string;
  title: string;
  panelName: string;
  dueDate: string;
}

export interface HomeMention {
  id: string;
  body: string;
  createdAt: string;
  taskId: string;
  taskTitle: string;
  author: BoardUser;
  isSeen: boolean;
}

export interface TaskStats {
  overdueCount: number;
  openCount: number;
  completedCount: number;
  score: number;
}

export interface TopScorer {
  name: string;
  score: number;
}

export interface HomeOverview {
  userName: string;
  stats: TaskStats;
  teamAverageScore: number;
  topScorer: TopScorer | null;
  deadlines: HomeDeadline[];
  mentions: HomeMention[];
}
