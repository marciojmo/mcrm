import type { BoardUser } from '@/types/board';

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
}

export interface HomeOverview {
  completedCount: number;
  pendingCount: number;
  deadlines: HomeDeadline[];
  mentions: HomeMention[];
}
