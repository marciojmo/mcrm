import { prisma } from '@/lib/prisma';
import type { BoardPanel } from '@/types/board';

export async function listPanels(boardId: string): Promise<BoardPanel[]> {
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
  const position = await prisma.panel.count({ where: { boardId } });
  return prisma.panel.create({ data: { boardId, name, position } });
}

export async function reorderPanels(panelIds: string[]) {
  await prisma.$transaction(
    panelIds.map((id, position) =>
      prisma.panel.update({ where: { id }, data: { position } })
    )
  );
}

export async function renamePanel(panelId: string, name: string) {
  return prisma.panel.update({ where: { id: panelId }, data: { name } });
}

export async function archivePanel(panelId: string) {
  return prisma.panel.update({
    where: { id: panelId },
    data: { archivedAt: new Date() },
  });
}
