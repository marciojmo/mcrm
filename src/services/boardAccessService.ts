import type { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { visibleTo } from '@/services/boardService';

async function assertVisibleBoard(
  userId: string,
  where: Prisma.BoardWhereInput
) {
  const board = await prisma.board.findFirst({
    where: { AND: [where, visibleTo(userId)] },
    select: { id: true },
  });
  if (!board) throw new Error('Board not found');
}

function withTask(task: Prisma.TaskWhereInput): Prisma.BoardWhereInput {
  return { panels: { some: { tasks: { some: task } } } };
}

function withActiveTask(task: Prisma.TaskWhereInput): Prisma.BoardWhereInput {
  return {
    panels: {
      some: {
        archivedAt: null,
        tasks: { some: { ...task, archivedAt: null } },
      },
    },
  };
}

export function assertBoardAccess(userId: string, boardId: string) {
  return assertVisibleBoard(userId, { id: boardId });
}

export function assertPanelAccess(userId: string, panelId: string) {
  return assertVisibleBoard(userId, {
    panels: { some: { id: panelId, archivedAt: null } },
  });
}

export function assertTaskReadAccess(userId: string, taskId: string) {
  return assertVisibleBoard(userId, withTask({ id: taskId }));
}

export function assertTaskAccess(userId: string, taskId: string) {
  return assertVisibleBoard(userId, withActiveTask({ id: taskId }));
}

export function assertLabelAccess(userId: string, labelId: string) {
  return assertVisibleBoard(userId, { labels: { some: { id: labelId } } });
}

export function assertChecklistAccess(userId: string, checklistId: string) {
  return assertVisibleBoard(
    userId,
    withActiveTask({ checklists: { some: { id: checklistId } } })
  );
}

export function assertChecklistItemAccess(userId: string, itemId: string) {
  return assertVisibleBoard(
    userId,
    withActiveTask({
      checklists: { some: { items: { some: { id: itemId } } } },
    })
  );
}

export function assertAttachmentReadAccess(
  userId: string,
  attachmentId: string
) {
  return assertVisibleBoard(
    userId,
    withTask({ attachments: { some: { id: attachmentId } } })
  );
}

export function assertAttachmentAccess(userId: string, attachmentId: string) {
  return assertVisibleBoard(
    userId,
    withActiveTask({ attachments: { some: { id: attachmentId } } })
  );
}

export function assertCommentAccess(userId: string, commentId: string) {
  return assertVisibleBoard(
    userId,
    withTask({ comments: { some: { id: commentId } } })
  );
}
