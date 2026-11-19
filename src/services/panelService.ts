import { prisma } from '@/lib/prisma';
import { formatTaskIdentifier } from '@/lib/taskIdentifier';
import { lockBoard } from '@/services/rowLocks';
import type { BoardPanel } from '@/types/board';

export async function listPanels(boardId: string): Promise<BoardPanel[]> {
  const board = await prisma.board.findUniqueOrThrow({
    where: { id: boardId },
    select: { key: true },
  });
  const panels = await prisma.panel.findMany({
    where: { boardId, archivedAt: null },
    orderBy: { position: 'asc' },
    select: {
      id: true,
      name: true,
      tasks: {
        where: { archivedAt: null },
        orderBy: { position: 'asc' },
        select: {
          id: true,
          number: true,
          title: true,
          description: true,
          dueDate: true,
          completedAt: true,
          labels: { select: { labelId: true } },
          members: { select: { userId: true } },
          followers: { select: { userId: true } },
          checklists: { select: { items: { select: { isDone: true } } } },
          _count: { select: { comments: true, attachments: true } },
        },
      },
    },
  });
  return panels.map((panel) => ({
    id: panel.id,
    name: panel.name,
    tasks: panel.tasks.map((task) => {
      const items = task.checklists.flatMap((checklist) => checklist.items);
      return {
        id: task.id,
        identifier: formatTaskIdentifier(board.key, task.number),
        title: task.title,
        description: task.description,
        dueDate: task.dueDate?.toISOString().slice(0, 10) ?? null,
        isCompleted: task.completedAt !== null,
        labelIds: task.labels.map((label) => label.labelId),
        memberIds: task.members.map((member) => member.userId),
        followerIds: task.followers.map((follower) => follower.userId),
        checklistDone: items.filter((item) => item.isDone).length,
        checklistTotal: items.length,
        attachmentCount: task._count.attachments,
        commentCount: task._count.comments,
      };
    }),
  }));
}

export async function createPanel(boardId: string, name: string) {
  return prisma.$transaction(async (tx) => {
    await lockBoard(tx, boardId);
    const { _max } = await tx.panel.aggregate({
      where: { boardId, archivedAt: null },
      _max: { position: true },
    });
    const position = (_max.position ?? -1) + 1;
    return tx.panel.create({ data: { boardId, name, position } });
  });
}

export async function reorderPanels(panelIds: string[]) {
  await prisma.$transaction(async (tx) => {
    if (panelIds.length === 0) throw new Error('Invalid panel order');
    const [first] = panelIds;
    const { boardId } = await tx.panel.findUniqueOrThrow({
      where: { id: first },
      select: { boardId: true },
    });
    await lockBoard(tx, boardId);
    const current = await tx.panel.findMany({
      where: { boardId, archivedAt: null },
      select: { id: true },
    });
    const currentIds = new Set(current.map(({ id }) => id));
    const isComplete =
      new Set(panelIds).size === panelIds.length &&
      panelIds.length === currentIds.size &&
      panelIds.every((id) => currentIds.has(id));
    if (!isComplete) throw new Error('Invalid panel order');
    for (const [position, id] of panelIds.entries()) {
      await tx.panel.update({ where: { id }, data: { position } });
    }
  });
}

export async function renamePanel(panelId: string, name: string) {
  return prisma.panel.update({
    where: { id: panelId, archivedAt: null },
    data: { name },
  });
}

export async function archivePanel(panelId: string) {
  return prisma.panel.update({
    where: { id: panelId, archivedAt: null },
    data: { archivedAt: new Date() },
  });
}
