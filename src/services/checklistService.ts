import { prisma } from '@/lib/prisma';
import { lockChecklist, lockTask } from '@/services/rowLocks';

export async function addChecklist(taskId: string, title: string) {
  return prisma.$transaction(async (tx) => {
    await lockTask(tx, taskId);
    const position = await tx.checklist.count({ where: { taskId } });
    return tx.checklist.create({ data: { taskId, title, position } });
  });
}

export async function deleteChecklist(checklistId: string) {
  return prisma.checklist.delete({ where: { id: checklistId } });
}

export async function addChecklistItem(checklistId: string, text: string) {
  return prisma.$transaction(async (tx) => {
    await lockChecklist(tx, checklistId);
    const position = await tx.checklistItem.count({ where: { checklistId } });
    return tx.checklistItem.create({ data: { checklistId, text, position } });
  });
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
