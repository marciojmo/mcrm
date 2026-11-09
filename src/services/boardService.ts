import type { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import type { BoardDetails, BoardSummary, BoardUser } from '@/types/board';

function visibleTo(userId: string) {
  return {
    archivedAt: null,
    OR: [{ ownerId: userId }, { members: { some: { userId } } }],
  };
}

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

export function assertBoardAccess(userId: string, boardId: string) {
  return assertVisibleBoard(userId, { id: boardId });
}

export function assertPanelAccess(userId: string, panelId: string) {
  return assertVisibleBoard(userId, { panels: { some: { id: panelId } } });
}

export function assertTaskAccess(userId: string, taskId: string) {
  return assertVisibleBoard(userId, withTask({ id: taskId }));
}

export function assertChecklistAccess(userId: string, checklistId: string) {
  return assertVisibleBoard(
    userId,
    withTask({ checklists: { some: { id: checklistId } } })
  );
}

export function assertChecklistItemAccess(userId: string, itemId: string) {
  return assertVisibleBoard(
    userId,
    withTask({ checklists: { some: { items: { some: { id: itemId } } } } })
  );
}

export function assertAttachmentAccess(userId: string, attachmentId: string) {
  return assertVisibleBoard(
    userId,
    withTask({ attachments: { some: { id: attachmentId } } })
  );
}

export async function listBoards(userId: string): Promise<BoardSummary[]> {
  return prisma.board.findMany({
    where: visibleTo(userId),
    select: { id: true, name: true },
    orderBy: { createdAt: 'asc' },
  });
}

export async function getBoard(
  boardId: string,
  userId: string
): Promise<BoardDetails | null> {
  return prisma.board.findFirst({
    where: { id: boardId, ...visibleTo(userId) },
    select: { id: true, name: true, ownerId: true },
  });
}

export async function listBoardMembers(boardId: string): Promise<BoardUser[]> {
  const board = await prisma.board.findUniqueOrThrow({
    where: { id: boardId },
    select: {
      owner: { select: { id: true, name: true, image: true } },
      members: {
        select: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { user: { name: 'asc' } },
      },
    },
  });
  return [board.owner, ...board.members.map((member) => member.user)];
}

export async function createBoard(name: string, ownerId: string) {
  return prisma.board.create({ data: { name, ownerId } });
}

export async function addBoardMember(
  boardId: string,
  ownerId: string,
  userId: string
) {
  await prisma.board.findFirstOrThrow({ where: { id: boardId, ownerId } });
  return prisma.boardMember.upsert({
    where: { boardId_userId: { boardId, userId } },
    create: { boardId, userId },
    update: {},
  });
}

export async function removeBoardMember(
  boardId: string,
  ownerId: string,
  userId: string
) {
  await prisma.board.findFirstOrThrow({ where: { id: boardId, ownerId } });
  await prisma.boardMember.deleteMany({ where: { boardId, userId } });
}

export async function archiveBoard(boardId: string, ownerId: string) {
  const { count } = await prisma.board.updateMany({
    where: { id: boardId, ownerId },
    data: { archivedAt: new Date() },
  });
  if (count === 0) throw new Error('Board not found');
}

export async function getTaskBoardId(taskId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { panel: { select: { boardId: true } } },
  });
  return task?.panel.boardId ?? null;
}
