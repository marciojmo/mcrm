import { calculateTaskStats } from '@/lib/calculateTaskStats';
import { prisma } from '@/lib/prisma';
import type { HomeOverview, HomeView } from '@/types/home';

const MAX_DEADLINES = 3;
const MAX_MENTIONS = 10;

async function getTeamScores(today: string) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      taskMembers: {
        where: { task: { archivedAt: null, panel: { archivedAt: null } } },
        select: { task: { select: { completedAt: true, dueDate: true } } },
      },
    },
  });
  return users.map((user) => ({
    id: user.id,
    name: user.name,
    stats: calculateTaskStats(
      user.taskMembers.map((member) => member.task),
      today
    ),
  }));
}

export async function getHomeOverview(
  userId: string,
  userName: string,
  today: string,
  view: HomeView
): Promise<HomeOverview> {
  const isOverview = view === 'overview';
  const [team, deadlines, mentions] = await Promise.all([
    getTeamScores(today),
    prisma.task.findMany({
      where: {
        archivedAt: null,
        panel: { archivedAt: null },
        members: { some: { userId } },
        completedAt: null,
        dueDate: { not: null },
      },
      orderBy: { dueDate: 'asc' },
      take: isOverview ? MAX_DEADLINES : undefined,
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
        ...(view === 'notifications'
          ? {}
          : { NOT: { seenByUserIds: { has: userId } } }),
        task: { archivedAt: null },
      },
      orderBy: { createdAt: 'desc' },
      take: isOverview ? MAX_MENTIONS : undefined,
      select: {
        id: true,
        body: true,
        createdAt: true,
        taskId: true,
        seenByUserIds: true,
        task: { select: { title: true } },
        author: { select: { id: true, name: true, image: true } },
      },
    }),
  ]);

  const scores = team.map((member) => member.stats.score);
  const top = team.reduce<(typeof team)[number] | null>(
    (best, member) =>
      !best || member.stats.score > best.stats.score ? member : best,
    null
  );

  return {
    userName,
    stats:
      team.find((member) => member.id === userId)?.stats ??
      calculateTaskStats([], today),
    teamAverageScore: scores.length
      ? Math.round(
          scores.reduce((sum, score) => sum + score, 0) / scores.length
        )
      : 0,
    topScorer: top ? { name: top.name, score: top.stats.score } : null,
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
      isSeen: comment.seenByUserIds.includes(userId),
    })),
  };
}
