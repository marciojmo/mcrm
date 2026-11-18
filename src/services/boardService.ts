import type { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import {
  formatTaskIdentifier,
  listBoardKeyCandidates,
  parseTaskIdentifiers,
} from '@/lib/taskIdentifier';
import type { BoardDetails, BoardSummary, BoardUser } from '@/types/board';
import type { TaskReference } from '@/types/task';

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

async function findFreeBoardKey(name: string) {
  const candidates = listBoardKeyCandidates(name);
  const taken = await prisma.board.findMany({
    where: { key: { in: candidates } },
    select: { key: true },
  });
  const takenKeys = new Set(taken.map((board) => board.key));
  const key = candidates.find((candidate) => !takenKeys.has(candidate));
  if (!key) throw new Error('No board key available');
  return key;
}

export async function createBoard(name: string, ownerId: string) {
  const key = await findFreeBoardKey(name);
  return prisma.board.create({ data: { name, key, ownerId } });
}

export async function renameBoard(boardId: string, name: string) {
  return prisma.board.update({ where: { id: boardId }, data: { name } });
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

export async function findTaskReferences(
  userId: string,
  texts: string[]
): Promise<TaskReference[]> {
  const identifiers = texts.flatMap(parseTaskIdentifiers);
  if (identifiers.length === 0) return [];
  const tasks = await prisma.task.findMany({
    where: {
      archivedAt: null,
      OR: identifiers.map(({ key, number }) => ({
        number,
        panel: { board: { key, ...visibleTo(userId) } },
      })),
    },
    select: {
      id: true,
      number: true,
      panel: { select: { board: { select: { id: true, key: true } } } },
    },
  });
  return tasks.map((task) => ({
    identifier: formatTaskIdentifier(task.panel.board.key, task.number),
    taskId: task.id,
    boardId: task.panel.board.id,
  }));
}
