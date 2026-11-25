'use server';

import { revalidatePath } from 'next/cache';
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '@/constants/auth';
import {
  changeUserRole as changeUserRoleRecord,
  createAccountUser,
  deactivateUser as deactivateUserRecord,
  reactivateUser as reactivateUserRecord,
  updateAccountProfile,
  resetUserPassword as resetUserPasswordRecord,
} from '@/services/accountUserService';
import { requireAdmin } from '@/services/sessionService';
import type { UserRole } from '@/types/accountUser';

const MAX_TEXT_LENGTH = 200;

function cleanText(value: string) {
  const text = typeof value === 'string' ? value.trim() : '';
  if (!text || text.length > MAX_TEXT_LENGTH) throw new Error('Invalid text');
  return text;
}

function cleanPassword(value: string) {
  if (
    typeof value !== 'string' ||
    value.length < MIN_PASSWORD_LENGTH ||
    value.length > MAX_PASSWORD_LENGTH
  )
    throw new Error('Invalid password');
  return value;
}

function cleanRole(value: string): UserRole {
  if (value !== 'admin' && value !== 'user') throw new Error('Invalid role');
  return value;
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}) {
  await requireAdmin();
  const result = await createAccountUser({
    name: cleanText(input.name),
    email: cleanText(input.email),
    password: cleanPassword(input.password),
    role: cleanRole(input.role),
  });
  revalidatePath('/admin', 'layout');
  return result;
}

export async function resetUserPassword(userId: string, password: string) {
  await requireAdmin();
  await resetUserPasswordRecord(cleanText(userId), cleanPassword(password));
}

export async function changeUserRole(userId: string, role: UserRole) {
  const { user } = await requireAdmin();
  const id = cleanText(userId);
  if (id === user.id) throw new Error('Cannot change own role');
  await changeUserRoleRecord(id, cleanRole(role));
  revalidatePath('/admin', 'layout');
}

export async function updateUserProfile(
  userId: string,
  input: { name: string; email: string }
) {
  await requireAdmin();
  const result = await updateAccountProfile(cleanText(userId), {
    name: cleanText(input.name),
    email: cleanText(input.email),
  });
  revalidatePath('/admin', 'layout');
  return result;
}

export async function deactivateUser(userId: string) {
  const { user } = await requireAdmin();
  const id = cleanText(userId);
  if (id === user.id) throw new Error('Cannot deactivate yourself');
  await deactivateUserRecord(id);
  revalidatePath('/admin', 'layout');
}

export async function reactivateUser(userId: string) {
  await requireAdmin();
  await reactivateUserRecord(cleanText(userId));
  revalidatePath('/admin', 'layout');
}
