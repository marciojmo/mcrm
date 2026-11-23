import { Suspense } from 'react';
import { env } from '@/config/env';
import { getToday } from '@/lib/appTime';
import { notFound } from 'next/navigation';
import { CollaboratorReport } from '@/components/features/admin/CollaboratorReport';
import { getCollaboratorReport } from '@/services/adminService';
import { requireAdmin } from '@/services/sessionService';
import AdminLoading from '../../loading';

async function Report({
  params,
}: {
  params: PageProps<'/admin/users/[userId]'>['params'];
}) {
  const { userId } = await params;
  await requireAdmin();
  const today = getToday(env.APP_TIME_ZONE);
  const report = await getCollaboratorReport(userId, today);
  if (!report) notFound();
  return <CollaboratorReport report={report} today={today} />;
}

export default function CollaboratorPage({
  params,
}: PageProps<'/admin/users/[userId]'>) {
  return (
    <Suspense fallback={<AdminLoading />}>
      <Report params={params} />
    </Suspense>
  );
}
