import { Suspense } from 'react';
import { env } from '@/config/env';
import { getToday } from '@/lib/appTime';
import { CollaboratorTable } from '@/components/features/admin/CollaboratorTable';
import { listCollaborators } from '@/services/adminService';
import { requireAdmin } from '@/services/sessionService';
import AdminLoading from './loading';

async function Overview() {
  await requireAdmin();
  const today = getToday(env.APP_TIME_ZONE);
  const collaborators = await listCollaborators(today);
  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <h1 className="text-xl font-semibold">Visão geral</h1>
        <p className="text-sm text-muted-foreground">
          {collaborators.length} colaboradores. Selecione um para ver o
          relatório completo.
        </p>
      </div>
      <CollaboratorTable collaborators={collaborators} />
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <Overview />
    </Suspense>
  );
}
