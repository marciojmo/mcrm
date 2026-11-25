import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { AdminPage } from '@/components/layouts/AdminPage';
import { AccountSection } from '@/components/features/admin/AccountSection';
import { getAccountUser } from '@/services/accountUserService';
import { requireAdmin } from '@/services/sessionService';
import UsersLoading from '../loading';

async function Details({
  params,
}: {
  params: PageProps<'/admin/users/[userId]'>['params'];
}) {
  const { userId } = await params;
  const { user } = await requireAdmin();
  const account = await getAccountUser(userId);
  if (!account) notFound();
  return (
    <AdminPage
      title={account.name}
      parent={{ label: 'Usuários', href: '/admin/users' }}
    >
      <AccountSection
        account={account}
        isCurrentUser={account.id === user.id}
      />
    </AdminPage>
  );
}

export default function UserDetailsPage({
  params,
}: PageProps<'/admin/users/[userId]'>) {
  return (
    <Suspense fallback={<UsersLoading />}>
      <Details params={params} />
    </Suspense>
  );
}
