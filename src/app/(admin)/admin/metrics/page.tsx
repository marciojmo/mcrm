import { Suspense } from 'react';
import { env } from '@/config/env';
import { getToday } from '@/lib/appTime';
import { AdminPage } from '@/components/layouts/AdminPage';
import { CollaboratorTable } from '@/components/features/admin/CollaboratorTable';
import { listCollaborators } from '@/services/adminService';
import { requireAdmin } from '@/services/sessionService';
import MetricsLoading from './loading';

async function Metrics() {
  await requireAdmin();
  const today = getToday(env.APP_TIME_ZONE);
  const collaborators = await listCollaborators(today);
  return (
    <AdminPage title="Métricas">
      <p className="text-sm text-muted-foreground">
        {collaborators.length} colaboradores. Selecione um para ver o relatório
        completo.
      </p>
      <CollaboratorTable collaborators={collaborators} />
    </AdminPage>
  );
}

export default function MetricsPage() {
  return (
    <Suspense fallback={<MetricsLoading />}>
      <Metrics />
    </Suspense>
  );
}
