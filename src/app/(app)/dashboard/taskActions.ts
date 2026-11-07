'use server';

import { revalidatePath } from 'next/cache';
import { LABEL_COLORS } from '@/constants/labelColors';
import {
  addChecklist as addChecklistRecord,
  addChecklistItem as addChecklistItemRecord,
  deleteChecklist as deleteChecklistRecord,
  deleteChecklistItem as deleteChecklistItemRecord,
  setChecklistItemDone as setChecklistItemDoneRecord,
} from '@/services/checklistService';
import {
  addComment as addCommentRecord,
  deleteComment as deleteCommentRecord,
  updateComment as updateCommentRecord,
} from '@/services/commentService';
import {
  addLinkAttachment as addLinkAttachmentRecord,
  deleteAttachment as deleteAttachmentRecord,
} from '@/services/attachmentService';
import {
  createLabel as createLabelRecord,
  deleteLabel as deleteLabelRecord,
  toggleTaskLabel as toggleTaskLabelRecord,
  updateLabel as updateLabelRecord,
} from '@/services/labelService';
import { toggleTaskMember as toggleTaskMemberRecord } from '@/services/memberService';
import { requireSession } from '@/services/sessionService';
import { getTaskExtras as getTaskExtrasRecord } from '@/services/taskExtrasService';

const MAX_NAME_LENGTH = 200;
const MAX_COMMENT_LENGTH = 5000;

function cleanText(value: string, maxLength = MAX_NAME_LENGTH) {
  const text = value.trim();
  if (!text || text.length > maxLength) throw new Error('Invalid text');
  return text;
}

function cleanColor(color: string) {
  if (!LABEL_COLORS.includes(color)) throw new Error('Invalid color');
  return color;
}

function cleanUrl(value: string) {
  const url = new URL(value.trim());
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error('Invalid url');
  }
  return url.toString();
}

async function refresh() {
  revalidatePath('/dashboard', 'layout');
  revalidatePath('/home');
}

export async function getTaskExtras(taskId: string) {
  await requireSession();
  return getTaskExtrasRecord(taskId);
}

export async function createLabel(name: string, color: string) {
  await requireSession();
  await createLabelRecord(
    name.trim().slice(0, MAX_NAME_LENGTH),
    cleanColor(color)
  );
  await refresh();
}

export async function updateLabel(id: string, name: string, color: string) {
  await requireSession();
  await updateLabelRecord(
    id,
    name.trim().slice(0, MAX_NAME_LENGTH),
    cleanColor(color)
  );
  await refresh();
}

export async function deleteLabel(id: string) {
  await requireSession();
  await deleteLabelRecord(id);
  await refresh();
}

export async function toggleTaskLabel(taskId: string, labelId: string) {
  await requireSession();
  await toggleTaskLabelRecord(taskId, labelId);
  await refresh();
}

export async function toggleTaskMember(taskId: string, userId: string) {
  await requireSession();
  await toggleTaskMemberRecord(taskId, userId);
  await refresh();
}

export async function addChecklist(taskId: string, title: string) {
  await requireSession();
  await addChecklistRecord(taskId, cleanText(title));
  await refresh();
}

export async function deleteChecklist(checklistId: string) {
  await requireSession();
  await deleteChecklistRecord(checklistId);
  await refresh();
}

export async function addChecklistItem(checklistId: string, text: string) {
  await requireSession();
  await addChecklistItemRecord(checklistId, cleanText(text));
  await refresh();
}

export async function setChecklistItemDone(itemId: string, isDone: boolean) {
  await requireSession();
  await setChecklistItemDoneRecord(itemId, isDone);
  await refresh();
}

export async function deleteChecklistItem(itemId: string) {
  await requireSession();
  await deleteChecklistItemRecord(itemId);
  await refresh();
}

export async function addComment(
  taskId: string,
  body: string,
  mentionedUserIds: string[]
) {
  const { user } = await requireSession();
  await addCommentRecord(
    taskId,
    user.id,
    cleanText(body, MAX_COMMENT_LENGTH),
    mentionedUserIds
  );
  await refresh();
}

export async function updateComment(
  commentId: string,
  body: string,
  mentionedUserIds: string[]
) {
  const { user } = await requireSession();
  await updateCommentRecord(
    commentId,
    user.id,
    cleanText(body, MAX_COMMENT_LENGTH),
    mentionedUserIds
  );
  await refresh();
}

export async function deleteComment(commentId: string) {
  const { user } = await requireSession();
  await deleteCommentRecord(commentId, user.id);
  await refresh();
}

export async function addLinkAttachment(
  taskId: string,
  url: string,
  name: string
) {
  await requireSession();
  const cleanUrlValue = cleanUrl(url);
  await addLinkAttachmentRecord(
    taskId,
    cleanUrlValue,
    name.trim().slice(0, MAX_NAME_LENGTH) || cleanUrlValue
  );
  await refresh();
}

export async function deleteAttachment(attachmentId: string) {
  await requireSession();
  await deleteAttachmentRecord(attachmentId);
  await refresh();
}
