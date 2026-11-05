'use server';

import { revalidatePath } from 'next/cache';
import type { TaskDetails } from '@/types/board';
import { requireSession } from '@/services/sessionService';
import {
  archivePanel as archivePanelRecord,
  createPanel as createPanelRecord,
  renamePanel as renamePanelRecord,
  reorderPanels as reorderPanelRecords,
} from '@/services/panelService';
import {
  createTask as createTaskRecord,
  moveTask as moveTaskRecord,
  updateTask as updateTaskRecord,
} from '@/services/taskService';

const MAX_TEXT_LENGTH = 200;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function cleanText(value: string) {
  const text = value.trim();
  if (!text || text.length > MAX_TEXT_LENGTH) throw new Error('Invalid text');
  return text;
}

export async function createPanel(name: string) {
  await requireSession();
  await createPanelRecord(cleanText(name));
  revalidatePath('/dashboard');
}

export async function reorderPanels(panelIds: string[]) {
  await requireSession();
  await reorderPanelRecords(panelIds);
  revalidatePath('/dashboard');
}

export async function createTask(panelId: string, title: string) {
  await requireSession();
  await createTaskRecord(panelId, cleanText(title));
  revalidatePath('/dashboard');
}

export async function moveTask(taskId: string, panelId: string, index: number) {
  await requireSession();
  await moveTaskRecord(taskId, panelId, index);
  revalidatePath('/dashboard');
}

export async function renamePanel(panelId: string, name: string) {
  await requireSession();
  await renamePanelRecord(panelId, cleanText(name));
  revalidatePath('/dashboard');
}

export async function archivePanel(panelId: string) {
  await requireSession();
  await archivePanelRecord(panelId);
  revalidatePath('/dashboard');
}

export async function updateTask(taskId: string, details: TaskDetails) {
  await requireSession();
  await updateTaskRecord(taskId, {
    title: cleanText(details.title),
    description: details.description?.trim() || null,
    dueDate:
      details.dueDate && ISO_DATE.test(details.dueDate)
        ? details.dueDate
        : null,
  });
  revalidatePath('/dashboard');
}
