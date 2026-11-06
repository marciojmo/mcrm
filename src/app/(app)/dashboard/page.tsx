import { Suspense } from 'react';
import { Board } from '@/components/features/board/Board';
import { listLabels } from '@/services/labelService';
import { listPanels } from '@/services/panelService';
import { requireSession } from '@/services/sessionService';
import { listUsers } from '@/services/userService';
import DashboardLoading from './loading';

async function Dashboard({
  searchParams,
}: {
  searchParams: PageProps<'/dashboard'>['searchParams'];
}) {
  const { task, comment } = await searchParams;
  const { user } = await requireSession();
  const [panels, users, labels] = await Promise.all([
    listPanels(),
    listUsers(),
    listLabels(),
  ]);
  return (
    <Board
      panels={panels}
      users={users}
      labels={labels}
      currentUserId={user.id}
      initialTaskId={typeof task === 'string' ? task : null}
      highlightCommentId={typeof comment === 'string' ? comment : null}
    />
  );
}

export default function DashboardPage({
  searchParams,
}: PageProps<'/dashboard'>) {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <Dashboard searchParams={searchParams} />
    </Suspense>
  );
}
