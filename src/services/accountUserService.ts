import { headers } from 'next/headers';
import { isAPIError } from 'better-auth/api';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { AccountUser, UserRole } from '@/types/accountUser';

const EMAIL_TAKEN_CODE = 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL';

const ACCOUNT_USER_SELECT = {
  id: true,
  name: true,
  email: true,
  image: true,
  role: true,
  banned: true,
  createdAt: true,
  accounts: { where: { providerId: 'google' }, select: { id: true } },
} as const;

function toAccountUser(user: {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  banned: boolean;
  createdAt: Date;
  accounts: { id: string }[];
}): AccountUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role === 'admin' ? 'admin' : 'user',
    isGoogleLinked: user.accounts.length > 0,
    isBanned: user.banned,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function listAccountUsers(): Promise<AccountUser[]> {
  const users = await prisma.user.findMany({
    orderBy: [{ banned: 'asc' }, { name: 'asc' }],
    select: ACCOUNT_USER_SELECT,
  });
  return users.map(toAccountUser);
}

export async function getAccountUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: ACCOUNT_USER_SELECT,
  });
  return user ? toAccountUser(user) : null;
}

export async function hasGoogleAccount(userId: string) {
  const count = await prisma.account.count({
    where: { userId, providerId: 'google' },
  });
  return count > 0;
}

async function runCatchingEmailTaken(action: () => Promise<unknown>) {
  try {
    await action();
    return { isEmailTaken: false };
  } catch (error) {
    const code = isAPIError(error) ? error.body?.code : null;
    if (code === EMAIL_TAKEN_CODE) return { isEmailTaken: true };
    throw error;
  }
}

export async function createAccountUser(input: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}) {
  return runCatchingEmailTaken(async () =>
    auth.api.createUser({
      headers: await headers(),
      body: { ...input, data: { emailVerified: true } },
    })
  );
}

export async function updateAccountProfile(
  userId: string,
  data: { name: string; email: string }
) {
  return runCatchingEmailTaken(async () =>
    auth.api.adminUpdateUser({
      headers: await headers(),
      body: { userId, data },
    })
  );
}

export async function deactivateUser(userId: string) {
  await auth.api.banUser({ headers: await headers(), body: { userId } });
}

export async function reactivateUser(userId: string) {
  await auth.api.unbanUser({ headers: await headers(), body: { userId } });
}

export async function resetUserPassword(userId: string, newPassword: string) {
  await auth.api.setUserPassword({
    headers: await headers(),
    body: { userId, newPassword },
  });
}

export async function changeUserRole(userId: string, role: UserRole) {
  await auth.api.setRole({ headers: await headers(), body: { userId, role } });
}
