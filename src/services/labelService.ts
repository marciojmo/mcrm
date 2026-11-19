import { prisma } from '@/lib/prisma';
import type { BoardLabel } from '@/types/board';

export async function listLabels(boardId: string): Promise<BoardLabel[]> {
  return prisma.label.findMany({
    where: { boardId },
    orderBy: { createdAt: 'asc' },
    select: { id: true, name: true, color: true },
  });
}

export async function createLabel(
  boardId: string,
  name: string,
  color: string
) {
  return prisma.label.create({ data: { boardId, name, color } });
}

export async function updateLabel(
  labelId: string,
  name: string,
  color: string
) {
  return prisma.label.update({ where: { id: labelId }, data: { name, color } });
}

export async function deleteLabel(labelId: string) {
  return prisma.label.delete({ where: { id: labelId } });
}

export async function toggleTaskLabel(taskId: string, labelId: string) {
  const label = await prisma.label.findFirst({
    where: {
      id: labelId,
      board: { panels: { some: { tasks: { some: { id: taskId } } } } },
    },
    select: { id: true },
  });
  if (!label) throw new Error('Label not found');
  const key = { taskId_labelId: { taskId, labelId } };
  const existing = await prisma.taskLabel.findUnique({ where: key });
  if (existing) return prisma.taskLabel.delete({ where: key });
  return prisma.taskLabel.create({ data: { taskId, labelId } });
}
