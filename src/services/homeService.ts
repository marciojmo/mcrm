import { prisma } from '@/lib/prisma';
import type { HomeOverview } from '@/types/home';

const MAX_DEADLINES = 3;
const MAX_MENTIONS = 10;

export async function getHomeOverview(userId: string): Promise<HomeOverview> {
  const assigned = {
    archivedAt: null,
    panel: { archivedAt: null },
    members: { some: { userId } },
  };
  const [completedCount, pendingCount, deadlines, mentions] = await Promise.all(
    [
      prisma.task.count({ where: { ...assigned, completedAt: { not: null } } }),
      prisma.task.count({ where: { ...assigned, completedAt: null } }),
      prisma.task.findMany({
        where: { ...assigned, completedAt: null, dueDate: { not: null } },
        orderBy: { dueDate: 'asc' },
        take: MAX_DEADLINES,
        select: {
          id: true,
          title: true,
          dueDate: true,
          panel: { select: { name: true } },
        },
      }),
      prisma.comment.findMany({
        where: {
          mentionedUserIds: { has: userId },
          authorId: { not: userId },
          task: { archivedAt: null },
        },
        orderBy: { createdAt: 'desc' },
        take: MAX_MENTIONS,
        select: {
          id: true,
          body: true,
          createdAt: true,
          taskId: true,
          task: { select: { title: true } },
          author: { select: { id: true, name: true, image: true } },
        },
      }),
    ]
  );

  return {
    completedCount,
    pendingCount,
    deadlines: deadlines.map((task) => ({
      id: task.id,
      title: task.title,
      panelName: task.panel.name,
      dueDate: task.dueDate!.toISOString().slice(0, 10),
    })),
    mentions: mentions.map((comment) => ({
      id: comment.id,
      body: comment.body,
      createdAt: comment.createdAt.toISOString(),
      taskId: comment.taskId,
      taskTitle: comment.task.title,
      author: comment.author,
    })),
  };
}
