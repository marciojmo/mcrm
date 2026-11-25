import { Suspense } from 'react';
import { env } from '@/config/env';
import { getToday } from '@/lib/appTime';
import { notFound } from 'next/navigation';
import { AccountSection } from '@/components/features/admin/AccountSection';
import { UserIdentityHeader } from '@/components/features/admin/UserIdentityHeader';
import { CollaboratorReport } from '@/components/features/admin/CollaboratorReport';
import { getCollaboratorReport } from '@/services/adminService';
import { getAccountUser } from '@/services/accountUserService';
import { requireAdmin } from '@/services/sessionService';
import AdminLoading from '../../loading';

async function Details({
  params,
}: {
  params: PageProps<'/admin/users/[userId]'>['params'];
}) {
  const { userId } = await params;
  const { user } = await requireAdmin();
  const today = getToday(env.APP_TIME_ZONE);
  const [account, report] = await Promise.all([
    getAccountUser(userId),
    getCollaboratorReport(userId, today),
  ]);
  if (!account || !report) notFound();
  return (
    <>
      <UserIdentityHeader report={report} />
      <AccountSection
        account={account}
        isCurrentUser={account.id === user.id}
      />
      <CollaboratorReport report={report} today={today} />
    </>
  );
}

export default function CollaboratorPage({
  params,
}: PageProps<'/admin/users/[userId]'>) {
  return (
    <Suspense fallback={<AdminLoading />}>
      <Details params={params} />
    </Suspense>
  );
}
