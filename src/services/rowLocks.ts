import { Prisma } from '@/generated/prisma/client';

export async function lockBoard(tx: Prisma.TransactionClient, id: string) {
  await tx.$queryRaw`SELECT id FROM boards WHERE id = ${id} FOR UPDATE`;
}

export async function lockPanels(tx: Prisma.TransactionClient, ids: string[]) {
  const sortedIds = [...new Set(ids)].sort();
  if (sortedIds.length === 0) return;
  const panels = await tx.panel.findMany({
    where: { id: { in: sortedIds } },
    select: { boardId: true },
  });
  const boardIds = [...new Set(panels.map(({ boardId }) => boardId))].sort();
  if (boardIds.length > 0) {
    await tx.$queryRaw`SELECT id FROM boards WHERE id IN (${Prisma.join(boardIds)}) ORDER BY id FOR UPDATE`;
  }
  await tx.$queryRaw`SELECT id FROM panels WHERE id IN (${Prisma.join(sortedIds)}) ORDER BY id FOR UPDATE`;
}

export async function lockTask(tx: Prisma.TransactionClient, id: string) {
  await tx.$queryRaw`SELECT id FROM tasks WHERE id = ${id} FOR UPDATE`;
}

export async function lockChecklist(tx: Prisma.TransactionClient, id: string) {
  await tx.$queryRaw`SELECT id FROM checklists WHERE id = ${id} FOR UPDATE`;
}
