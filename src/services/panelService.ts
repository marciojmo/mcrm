import { prisma } from '@/lib/prisma';
import type { BoardPanel } from '@/types/board';

export async function listPanels(): Promise<BoardPanel[]> {
  const panels = await prisma.panel.findMany({
    where: { archivedAt: null },
    orderBy: { position: 'asc' },
    select: {
      id: true,
      name: true,
      tasks: {
        orderBy: { position: 'asc' },
        select: {
          id: true,
          title: true,
          description: true,
          dueDate: true,
          labels: { select: { labelId: true } },
          members: { select: { userId: true } },
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
        labelIds: task.labels.map((label) => label.labelId),
        memberIds: task.members.map((member) => member.userId),
        checklistDone: items.filter((item) => item.isDone).length,
        checklistTotal: items.length,
        attachmentCount: task._count.attachments,
        commentCount: task._count.comments,
      };
    }),
  }));
}

export async function createPanel(name: string) {
  const position = await prisma.panel.count();
  return prisma.panel.create({ data: { name, position } });
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
