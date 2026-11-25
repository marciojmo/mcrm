import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireSession() {
  const session = await getSession();
  if (!session) redirect('/');
  return session;
}

export function isAdminUser(user: { role?: string | null }) {
  return user.role === 'admin';
}

export async function requireAdmin() {
  const session = await requireSession();
  if (!isAdminUser(session.user)) notFound();
  return session;
}
