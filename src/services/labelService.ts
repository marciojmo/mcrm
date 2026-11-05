import { prisma } from '@/lib/prisma';
import type { BoardLabel } from '@/types/board';

export async function listLabels(): Promise<BoardLabel[]> {
  return prisma.label.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, name: true, color: true },
  });
}

export async function createLabel(name: string, color: string) {
  return prisma.label.create({ data: { name, color } });
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
  const key = { taskId_labelId: { taskId, labelId } };
  const existing = await prisma.taskLabel.findUnique({ where: key });
  if (existing) return prisma.taskLabel.delete({ where: key });
  return prisma.taskLabel.create({ data: { taskId, labelId } });
}
