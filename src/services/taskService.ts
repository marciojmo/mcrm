import type { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { lockPanels } from '@/services/rowLocks';
import type { TaskDetails } from '@/types/board';

async function claimTaskNumber(tx: Prisma.TransactionClient, panelId: string) {
  const { boardId } = await tx.panel.findUniqueOrThrow({
    where: { id: panelId, archivedAt: null },
    select: { boardId: true },
  });
  const board = await tx.board.update({
    where: { id: boardId },
    data: { lastTaskNumber: { increment: 1 } },
    select: { lastTaskNumber: true },
  });
  return board.lastTaskNumber;
}

async function nextTaskPosition(tx: Prisma.TransactionClient, panelId: string) {
  const { _max } = await tx.task.aggregate({
    where: { panelId, archivedAt: null },
    _max: { position: true },
  });
  return (_max.position ?? -1) + 1;
}

async function renumberTasks(
  tx: Prisma.TransactionClient,
  panelId: string,
  ids?: string[]
) {
  const orderedIds =
    ids ??
    (
      await tx.task.findMany({
        where: { panelId, archivedAt: null },
        orderBy: { position: 'asc' },
        select: { id: true },
      })
    ).map(({ id }) => id);
  for (const [position, id] of orderedIds.entries()) {
    await tx.task.update({ where: { id }, data: { position } });
  }
}

export async function createTask(panelId: string, title: string) {
  return prisma.$transaction(async (tx) => {
    await lockPanels(tx, [panelId]);
    const position = await nextTaskPosition(tx, panelId);
    const number = await claimTaskNumber(tx, panelId);
    return tx.task.create({ data: { panelId, title, position, number } });
  });
}

export async function updateTask(taskId: string, details: TaskDetails) {
  return prisma.task.update({
    where: { id: taskId, archivedAt: null },
    data: {
      ...details,
      dueDate: details.dueDate ? new Date(details.dueDate) : null,
    },
  });
}

export async function archiveTask(taskId: string) {
  return prisma.task.update({
    where: { id: taskId, archivedAt: null },
    data: { archivedAt: new Date() },
  });
}

export async function archivePanelTasks(panelId: string) {
  return prisma.$transaction(async (tx) => {
    await lockPanels(tx, [panelId]);
    await tx.panel.findUniqueOrThrow({
      where: { id: panelId, archivedAt: null },
      select: { id: true },
    });
    return tx.task.updateMany({
      where: { panelId, archivedAt: null },
      data: { archivedAt: new Date() },
    });
  });
}

export async function moveTask(
  taskId: string,
  targetPanelId: string,
  targetIndex: number
) {
  if (!Number.isInteger(targetIndex) || targetIndex < 0) {
    throw new Error('Invalid index');
  }
  await prisma.$transaction(async (tx) => {
    const { panelId: sourcePanelId } = await tx.task.findUniqueOrThrow({
      where: { id: taskId, archivedAt: null },
      select: { panelId: true },
    });
    await lockPanels(tx, [sourcePanelId, targetPanelId]);
    const task = await tx.task.findUniqueOrThrow({
      where: { id: taskId, archivedAt: null },
    });
    if (task.panelId !== sourcePanelId) throw new Error('Task moved');
    await tx.panel.findUniqueOrThrow({
      where: { id: targetPanelId, archivedAt: null },
      select: { id: true },
    });
    const targetIds = (
      await tx.task.findMany({
        where: {
          panelId: targetPanelId,
          archivedAt: null,
          id: { not: taskId },
        },
        orderBy: { position: 'asc' },
        select: { id: true },
      })
    ).map((item) => item.id);
    targetIds.splice(Math.min(targetIndex, targetIds.length), 0, taskId);

    await tx.task.update({
      where: { id: taskId },
      data: { panelId: targetPanelId },
    });
    await renumberTasks(tx, targetPanelId, targetIds);
    if (task.panelId !== targetPanelId) await renumberTasks(tx, task.panelId);
  });
}

export async function setTaskCompleted(taskId: string, isCompleted: boolean) {
  return prisma.task.update({
    where: { id: taskId, archivedAt: null },
    data: { completedAt: isCompleted ? new Date() : null },
  });
}

export async function toggleTaskFollower(taskId: string, userId: string) {
  const key = { taskId_userId: { taskId, userId } };
  const existing = await prisma.taskFollower.findUnique({ where: key });
  if (existing) return prisma.taskFollower.delete({ where: key });
  return prisma.taskFollower.create({ data: { taskId, userId } });
}

export async function duplicateTask(taskId: string) {
  const source = await prisma.task.findUniqueOrThrow({
    where: { id: taskId, archivedAt: null },
    include: {
      labels: true,
      members: true,
      checklists: { include: { items: true } },
    },
  });
  return prisma.$transaction(async (tx) => {
    await lockPanels(tx, [source.panelId]);
    const position = await nextTaskPosition(tx, source.panelId);
    const number = await claimTaskNumber(tx, source.panelId);
    return tx.task.create({
      data: {
        panelId: source.panelId,
        number,
        title: source.title,
        description: source.description,
        dueDate: source.dueDate,
        position,
        labels: {
          create: source.labels.map(({ labelId }) => ({ labelId })),
        },
        members: {
          create: source.members.map(({ userId }) => ({ userId })),
        },
        checklists: {
          create: source.checklists.map((checklist) => ({
            title: checklist.title,
            position: checklist.position,
            items: {
              create: checklist.items.map(({ text, isDone, position }) => ({
                text,
                isDone,
                position,
              })),
            },
          })),
        },
      },
    });
  });
}
