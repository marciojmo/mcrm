import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { env } from '@/config/env';
import { auth } from '@/lib/auth';

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireSession() {
  const session = await getSession();
  if (!session) redirect('/');
  return session;
}

export function isAdminEmail(email: string) {
  return env.ADMIN_EMAILS.includes(email.toLowerCase());
}

export async function requireAdmin() {
  const session = await requireSession();
  if (!isAdminEmail(session.user.email)) notFound();
  return session;
}
