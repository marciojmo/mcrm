import type { BoardUser } from '@/types/board';

export interface ChecklistItem {
  id: string;
  text: string;
  isDone: boolean;
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface TaskComment {
  id: string;
  body: string;
  createdAt: string;
  author: BoardUser;
  mentionedUserIds: string[];
}

export interface TaskAttachment {
  id: string;
  name: string;
  url: string | null;
  mimeType: string | null;
  size: number | null;
  createdAt: string;
}

export interface TaskExtras {
  checklists: Checklist[];
  comments: TaskComment[];
  attachments: TaskAttachment[];
}
