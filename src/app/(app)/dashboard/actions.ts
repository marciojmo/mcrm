'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { MAX_DESCRIPTION_LENGTH } from '@/constants/task';
import type { TaskDetails } from '@/types/board';
import { isAdminEmail, requireSession } from '@/services/sessionService';
import {
  addBoardMember as addBoardMemberRecord,
  archiveBoard as archiveBoardRecord,
  createBoard as createBoardRecord,
  removeBoardMember as removeBoardMemberRecord,
  renameBoard as renameBoardRecord,
  setBoardBackground as setBoardBackgroundRecord,
} from '@/services/boardService';
import {
  assertBoardAccess,
  assertPanelAccess,
  assertTaskAccess,
} from '@/services/boardAccessService';
import {
  archivePanel as archivePanelRecord,
  createPanel as createPanelRecord,
  renamePanel as renamePanelRecord,
  reorderPanels as reorderPanelRecords,
} from '@/services/panelService';
import {
  archiveTask as archiveTaskRecord,
  createTask as createTaskRecord,
  duplicateTask as duplicateTaskRecord,
  moveTask as moveTaskRecord,
  setTaskCompleted as setTaskCompletedRecord,
  toggleTaskFollower as toggleTaskFollowerRecord,
  updateTask as updateTaskRecord,
} from '@/services/taskService';

const MAX_TEXT_LENGTH = 200;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function cleanText(value: string) {
  const text = typeof value === 'string' ? value.trim() : '';
  if (!text || text.length > MAX_TEXT_LENGTH) throw new Error('Invalid text');
  return text;
}

function cleanDescription(value: string | null) {
  if (!value) return null;
  if (typeof value !== 'string' || value.length > MAX_DESCRIPTION_LENGTH)
    throw new Error('Invalid description');
  return value.trim() || null;
}

function cleanDueDate(value: string | null) {
  if (!value) return null;
  const date = new Date(ISO_DATE.test(value) ? value : NaN);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value)
    throw new Error('Invalid due date');
  return value;
}

export async function createBoard(name: string) {
  const { user } = await requireSession();
  const board = await createBoardRecord(cleanText(name), user.id);
  revalidatePath('/dashboard', 'layout');
  redirect(`/dashboard/${board.id}`);
}

export async function renameBoard(boardId: string, name: string) {
  const { user } = await requireSession();
  await assertBoardAccess(user.id, boardId);
  await renameBoardRecord(boardId, cleanText(name));
  revalidatePath('/dashboard', 'layout');
}

export async function setBoardBackground(
  boardId: string,
  background: string | null
) {
  const { user } = await requireSession();
  await setBoardBackgroundRecord(
    boardId,
    user.id,
    isAdminEmail(user.email),
    background
  );
  revalidatePath('/dashboard', 'layout');
}

export async function addBoardMember(boardId: string, userId: string) {
  const { user } = await requireSession();
  await addBoardMemberRecord(boardId, user.id, userId);
  revalidatePath('/dashboard', 'layout');
}

export async function removeBoardMember(boardId: string, userId: string) {
  const { user } = await requireSession();
  await removeBoardMemberRecord(boardId, user.id, userId);
  revalidatePath('/dashboard', 'layout');
}

export async function archiveBoard(boardId: string) {
  const { user } = await requireSession();
  await archiveBoardRecord(boardId, user.id);
  revalidatePath('/dashboard', 'layout');
  redirect('/dashboard');
}

export async function createPanel(boardId: string, name: string) {
  const { user } = await requireSession();
  await assertBoardAccess(user.id, boardId);
  await createPanelRecord(boardId, cleanText(name));
  revalidatePath('/dashboard', 'layout');
}

export async function reorderPanels(panelIds: string[]) {
  const { user } = await requireSession();
  await Promise.all(panelIds.map((id) => assertPanelAccess(user.id, id)));
  await reorderPanelRecords(panelIds);
  revalidatePath('/dashboard', 'layout');
}

export async function createTask(panelId: string, title: string) {
  const { user } = await requireSession();
  await assertPanelAccess(user.id, panelId);
  await createTaskRecord(panelId, cleanText(title));
  revalidatePath('/dashboard', 'layout');
}

export async function moveTask(taskId: string, panelId: string, index: number) {
  if (!Number.isInteger(index) || index < 0) throw new Error('Invalid index');
  const { user } = await requireSession();
  await Promise.all([
    assertTaskAccess(user.id, taskId),
    assertPanelAccess(user.id, panelId),
  ]);
  await moveTaskRecord(taskId, panelId, index);
  revalidatePath('/dashboard', 'layout');
}

export async function renamePanel(panelId: string, name: string) {
  const { user } = await requireSession();
  await assertPanelAccess(user.id, panelId);
  await renamePanelRecord(panelId, cleanText(name));
  revalidatePath('/dashboard', 'layout');
}

export async function archivePanel(panelId: string) {
  const { user } = await requireSession();
  await assertPanelAccess(user.id, panelId);
  await archivePanelRecord(panelId);
  revalidatePath('/dashboard', 'layout');
}

export async function updateTask(taskId: string, details: TaskDetails) {
  const { user } = await requireSession();
  await assertTaskAccess(user.id, taskId);
  await updateTaskRecord(taskId, {
    title: cleanText(details.title),
    description: cleanDescription(details.description),
    dueDate: cleanDueDate(details.dueDate),
  });
  revalidatePath('/dashboard', 'layout');
}

export async function archiveTask(taskId: string) {
  const { user } = await requireSession();
  await assertTaskAccess(user.id, taskId);
  await archiveTaskRecord(taskId);
  revalidatePath('/dashboard', 'layout');
}

export async function duplicateTask(taskId: string) {
  const { user } = await requireSession();
  await assertTaskAccess(user.id, taskId);
  await duplicateTaskRecord(taskId);
  revalidatePath('/dashboard', 'layout');
}

export async function toggleTaskFollower(taskId: string) {
  const { user } = await requireSession();
  await assertTaskAccess(user.id, taskId);
  await toggleTaskFollowerRecord(taskId, user.id);
  revalidatePath('/dashboard', 'layout');
}

export async function setTaskCompleted(taskId: string, isCompleted: boolean) {
  if (typeof isCompleted !== 'boolean') throw new Error('Invalid status');
  const { user } = await requireSession();
  await assertTaskAccess(user.id, taskId);
  await setTaskCompletedRecord(taskId, isCompleted);
  revalidatePath('/dashboard', 'layout');
  revalidatePath('/home');
}
