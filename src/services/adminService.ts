import { env } from '@/config/env';
import { getStartOfDay } from '@/lib/appTime';
import { calculateTaskStats } from '@/lib/calculateTaskStats';
import { prisma } from '@/lib/prisma';
import type {
  CollaboratorBoard,
  CollaboratorReport,
  CollaboratorSummary,
  CollaboratorTask,
} from '@/types/admin';

const REPORT_WINDOW_DAYS = 30;
const MAX_RECENTLY_COMPLETED = 10;

const ACTIVE_TASK = {
  archivedAt: null,
  panel: { archivedAt: null, board: { archivedAt: null } },
};

const LAST_SESSION = {
  select: { updatedAt: true },
  orderBy: { updatedAt: 'desc' as const },
  take: 1,
};

export async function listCollaborators(
  today: string
): Promise<CollaboratorSummary[]> {
  const users = await prisma.user.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      sessions: LAST_SESSION,
      taskMembers: {
        where: { task: ACTIVE_TASK },
        select: { task: { select: { completedAt: true, dueDate: true } } },
      },
    },
  });
  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    lastSeenAt: user.sessions[0]?.updatedAt.toISOString() ?? null,
    stats: calculateTaskStats(
      user.taskMembers.map((member) => member.task),
      today
    ),
  }));
}

function groupByBoard(
  tasks: {
    completedAt: Date | null;
    dueDate: Date | null;
    board: { id: string; name: string };
  }[],
  today: string
): CollaboratorBoard[] {
  const boards = new Map<string, { name: string; tasks: typeof tasks }>();
  for (const task of tasks) {
    const entry = boards.get(task.board.id) ?? {
      name: task.board.name,
      tasks: [],
    };
    entry.tasks.push(task);
    boards.set(task.board.id, entry);
  }
  return [...boards]
    .map(([id, board]) => ({
      id,
      name: board.name,
      stats: calculateTaskStats(board.tasks, today),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getCollaboratorReport(
  userId: string,
  today: string
): Promise<CollaboratorReport | null> {
  const windowStart = new Date(`${today}T00:00:00Z`);
  windowStart.setUTCDate(windowStart.getUTCDate() - REPORT_WINDOW_DAYS);
  const since = getStartOfDay(
    windowStart.toISOString().slice(0, 10),
    env.APP_TIME_ZONE
  );
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      sessions: LAST_SESSION,
      _count: {
        select: { comments: { where: { createdAt: { gte: since } } } },
      },
      taskMembers: {
        where: { task: ACTIVE_TASK },
        select: {
          task: {
            select: {
              id: true,
              title: true,
              dueDate: true,
              completedAt: true,
              panel: {
                select: {
                  name: true,
                  board: { select: { id: true, name: true } },
                },
              },
            },
          },
        },
      },
    },
  });
  if (!user) return null;

  const tasks = user.taskMembers.map(({ task }) => ({
    ...task,
    board: task.panel.board,
  }));
  const toCollaboratorTask = (
    task: (typeof tasks)[number]
  ): CollaboratorTask => ({
    id: task.id,
    title: task.title,
    boardName: task.board.name,
    panelName: task.panel.name,
    dueDate: task.dueDate?.toISOString().slice(0, 10) ?? null,
    completedAt: task.completedAt?.toISOString() ?? null,
  });
  const completed = tasks
    .filter((task) => task.completedAt)
    .sort((a, b) => b.completedAt!.getTime() - a.completedAt!.getTime());

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    joinedAt: user.createdAt.toISOString(),
    lastSeenAt: user.sessions[0]?.updatedAt.toISOString() ?? null,
    stats: calculateTaskStats(tasks, today),
    completedLast30Days: completed.filter((task) => task.completedAt! >= since)
      .length,
    commentsLast30Days: user._count.comments,
    boards: groupByBoard(tasks, today),
    openTasks: tasks
      .filter((task) => !task.completedAt)
      .sort(
        (a, b) =>
          (a.dueDate?.getTime() ?? Infinity) -
          (b.dueDate?.getTime() ?? Infinity)
      )
      .map(toCollaboratorTask),
    recentlyCompleted: completed
      .slice(0, MAX_RECENTLY_COMPLETED)
      .map(toCollaboratorTask),
  };
}
