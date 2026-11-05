import { prisma } from '@/lib/prisma';

export async function addChecklist(taskId: string, title: string) {
  const position = await prisma.checklist.count({ where: { taskId } });
  return prisma.checklist.create({ data: { taskId, title, position } });
}

export async function deleteChecklist(checklistId: string) {
  return prisma.checklist.delete({ where: { id: checklistId } });
}

export async function addChecklistItem(checklistId: string, text: string) {
  const position = await prisma.checklistItem.count({ where: { checklistId } });
  return prisma.checklistItem.create({ data: { checklistId, text, position } });
}

export async function setChecklistItemDone(itemId: string, isDone: boolean) {
  return prisma.checklistItem.update({
    where: { id: itemId },
    data: { isDone },
  });
}

export async function deleteChecklistItem(itemId: string) {
  return prisma.checklistItem.delete({ where: { id: itemId } });
}
