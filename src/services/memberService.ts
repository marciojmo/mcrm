import { prisma } from '@/lib/prisma';

export async function toggleTaskMember(taskId: string, userId: string) {
  const key = { taskId_userId: { taskId, userId } };
  const existing = await prisma.taskMember.findUnique({ where: key });
  if (existing) return prisma.taskMember.delete({ where: key });
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { banned: true },
  });
  if (user.banned) throw new Error('User is deactivated');
  return prisma.taskMember.create({ data: { taskId, userId } });
}
