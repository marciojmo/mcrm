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
      mentionedUserIds: await filterExistingUserIds(mentionedUserIds),
    },
  });
}

async function filterExistingUserIds(userIds: string[]) {
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
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
  const { count } = await prisma.comment.updateMany({
    where: { id: commentId, authorId, task: ACTIVE_TASK },
    data: {
      body,
      mentionedUserIds: await filterExistingUserIds(mentionedUserIds),
    },
  });
  if (count === 0) throw new Error('Comment not found');
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
