import { Prisma } from '@/generated/prisma/client';

export async function lockBoard(tx: Prisma.TransactionClient, id: string) {
  await tx.$queryRaw`SELECT id FROM boards WHERE id = ${id} FOR UPDATE`;
}

export async function lockPanels(tx: Prisma.TransactionClient, ids: string[]) {
  const sortedIds = [...new Set(ids)].sort();
  await tx.$queryRaw`SELECT id FROM panels WHERE id IN (${Prisma.join(sortedIds)}) ORDER BY id FOR UPDATE`;
}

export async function lockTask(tx: Prisma.TransactionClient, id: string) {
  await tx.$queryRaw`SELECT id FROM tasks WHERE id = ${id} FOR UPDATE`;
}

export async function lockChecklist(tx: Prisma.TransactionClient, id: string) {
  await tx.$queryRaw`SELECT id FROM checklists WHERE id = ${id} FOR UPDATE`;
}
