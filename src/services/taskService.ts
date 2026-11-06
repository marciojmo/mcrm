import { prisma } from '@/lib/prisma';
import type { TaskDetails } from '@/types/board';

export async function createTask(panelId: string, title: string) {
  const position = await prisma.task.count({ where: { panelId } });
  return prisma.task.create({ data: { panelId, title, position } });
}

export async function updateTask(taskId: string, details: TaskDetails) {
  return prisma.task.update({
    where: { id: taskId },
    data: {
      ...details,
      dueDate: details.dueDate ? new Date(details.dueDate) : null,
    },
  });
}

export async function archiveTask(taskId: string) {
  return prisma.task.update({
    where: { id: taskId },
    data: { archivedAt: new Date() },
  });
}

export async function moveTask(
  taskId: string,
  targetPanelId: string,
  targetIndex: number
) {
  await prisma.$transaction(async (tx) => {
    const task = await tx.task.findUniqueOrThrow({ where: { id: taskId } });
    const targetIds = (
      await tx.task.findMany({
        where: { panelId: targetPanelId, id: { not: taskId } },
        orderBy: { position: 'asc' },
        select: { id: true },
      })
    ).map((item) => item.id);
    targetIds.splice(targetIndex, 0, taskId);

    await tx.task.update({
      where: { id: taskId },
      data: { panelId: targetPanelId },
    });
    await Promise.all(
      targetIds.map((id, position) =>
        tx.task.update({ where: { id }, data: { position } })
      )
    );

    if (task.panelId === targetPanelId) return;
    const sourceIds = await tx.task.findMany({
      where: { panelId: task.panelId },
      orderBy: { position: 'asc' },
      select: { id: true },
    });
    await Promise.all(
      sourceIds.map(({ id }, position) =>
        tx.task.update({ where: { id }, data: { position } })
      )
    );
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
    where: { id: taskId },
    include: {
      labels: true,
      members: true,
      checklists: { include: { items: true } },
    },
  });
  const position = await prisma.task.count({
    where: { panelId: source.panelId, archivedAt: null },
  });
  return prisma.task.create({
    data: {
      panelId: source.panelId,
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
}
