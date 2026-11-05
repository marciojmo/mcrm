import { prisma } from '@/lib/prisma';
import type { BoardUser } from '@/types/board';

export async function listUsers(): Promise<BoardUser[]> {
  return prisma.user.findMany({
    select: { id: true, name: true, image: true },
    orderBy: { name: 'asc' },
  });
}
