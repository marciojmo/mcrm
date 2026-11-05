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
