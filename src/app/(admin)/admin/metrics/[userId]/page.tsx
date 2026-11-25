import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { env } from '@/config/env';
import { getToday } from '@/lib/appTime';
import { AdminPage } from '@/components/layouts/AdminPage';
import { CollaboratorReport } from '@/components/features/admin/CollaboratorReport';
import { UserIdentityHeader } from '@/components/features/admin/UserIdentityHeader';
import { getCollaboratorReport } from '@/services/adminService';
import { requireAdmin } from '@/services/sessionService';
import MetricsLoading from '../loading';

async function Report({
  params,
}: {
  params: PageProps<'/admin/metrics/[userId]'>['params'];
}) {
  const { userId } = await params;
  await requireAdmin();
  const today = getToday(env.APP_TIME_ZONE);
  const report = await getCollaboratorReport(userId, today);
  if (!report) notFound();
  return (
    <AdminPage
      title={report.name}
      parent={{ label: 'Métricas', href: '/admin/metrics' }}
    >
      <UserIdentityHeader report={report} />
      <CollaboratorReport report={report} today={today} />
    </AdminPage>
  );
}

export default function CollaboratorMetricsPage({
  params,
}: PageProps<'/admin/metrics/[userId]'>) {
  return (
    <Suspense fallback={<MetricsLoading />}>
      <Report params={params} />
    </Suspense>
  );
}
