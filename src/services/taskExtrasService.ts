import { prisma } from '@/lib/prisma';
import type { TaskExtras } from '@/types/task';

export async function getTaskExtras(taskId: string): Promise<TaskExtras> {
  const task = await prisma.task.findUniqueOrThrow({
    where: { id: taskId },
    select: {
      checklists: {
        orderBy: { position: 'asc' },
        select: {
          id: true,
          title: true,
          items: {
            orderBy: { position: 'asc' },
            select: { id: true, text: true, isDone: true },
          },
        },
      },
      comments: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          body: true,
          createdAt: true,
          mentionedUserIds: true,
          author: { select: { id: true, name: true, image: true } },
        },
      },
      attachments: {
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          name: true,
          url: true,
          mimeType: true,
          size: true,
          createdAt: true,
        },
      },
    },
  });
  return {
    checklists: task.checklists,
    comments: task.comments.map((comment) => ({
      ...comment,
      createdAt: comment.createdAt.toISOString(),
    })),
    attachments: task.attachments.map((attachment) => ({
      ...attachment,
      createdAt: attachment.createdAt.toISOString(),
    })),
  };
}
