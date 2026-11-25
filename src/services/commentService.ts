import { prisma } from '@/lib/prisma';

const ACTIVE_TASK = { archivedAt: null, panel: { archivedAt: null } };

export async function addComment(
  taskId: string,
  authorId: string,
  body: string,
  mentionedUserIds: string[]
) {
  return prisma.comment.create({
    data: {
      taskId,
      authorId,
      body,
      mentionedUserIds: await filterBoardUserIds(taskId, mentionedUserIds),
    },
  });
}

async function filterBoardUserIds(taskId: string, userIds: string[]) {
  const board = { panels: { some: { tasks: { some: { id: taskId } } } } };
  const users = await prisma.user.findMany({
    where: {
      id: { in: userIds },
      banned: false,
      OR: [
        { boards: { some: board } },
        { boardMemberships: { some: { board } } },
      ],
    },
    select: { id: true },
  });
  return users.map((user) => user.id);
}

export async function updateComment(
  commentId: string,
  authorId: string,
  body: string,
  mentionedUserIds: string[]
) {
  const comment = await prisma.comment.findFirst({
    where: { id: commentId, authorId, task: ACTIVE_TASK },
    select: { taskId: true },
  });
  if (!comment) throw new Error('Comment not found');
  await prisma.comment.update({
    where: { id: commentId },
    data: {
      body,
      mentionedUserIds: await filterBoardUserIds(
        comment.taskId,
        mentionedUserIds
      ),
    },
  });
}

export async function markMentionSeen(commentId: string, userId: string) {
  await prisma.comment.updateMany({
    where: {
      id: commentId,
      mentionedUserIds: { has: userId },
      NOT: { seenByUserIds: { has: userId } },
    },
    data: { seenByUserIds: { push: userId } },
  });
}

export async function deleteComment(commentId: string, authorId: string) {
  const { count } = await prisma.comment.deleteMany({
    where: { id: commentId, authorId, task: ACTIVE_TASK },
  });
  if (count === 0) throw new Error('Comment not found');
}
