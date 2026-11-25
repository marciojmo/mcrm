export interface BoardUser {
  id: string;
  name: string;
  image: string | null;
  isBanned?: boolean;
}

export interface BoardLabel {
  id: string;
  name: string;
  color: string;
}

export interface BoardTask {
  id: string;
  identifier: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  isCompleted: boolean;
  labelIds: string[];
  memberIds: string[];
  followerIds: string[];
  checklistDone: number;
  checklistTotal: number;
  attachmentCount: number;
  commentCount: number;
}

export interface TaskDetails {
  title: string;
  description: string | null;
  dueDate: string | null;
}

export interface BoardPanel {
  id: string;
  name: string;
  tasks: BoardTask[];
}

export interface BoardSummary {
  id: string;
  name: string;
}

export interface BoardDetails extends BoardSummary {
  ownerId: string;
  background: string | null;
}
