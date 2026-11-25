import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { AccountUser, UserRole } from '@/types/accountUser';

export async function listAccountUsers(): Promise<AccountUser[]> {
  const users = await prisma.user.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      accounts: { where: { providerId: 'google' }, select: { id: true } },
    },
  });
  return users.map(({ accounts, role, ...user }) => ({
    ...user,
    role: role === 'admin' ? 'admin' : 'user',
    isGoogleLinked: accounts.length > 0,
  }));
}

export async function hasGoogleAccount(userId: string) {
  const count = await prisma.account.count({
    where: { userId, providerId: 'google' },
  });
  return count > 0;
}

export async function createAccountUser(input: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}) {
  await auth.api.createUser({ headers: await headers(), body: input });
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
