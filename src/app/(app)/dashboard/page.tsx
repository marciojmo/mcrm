import { Suspense } from 'react';
import { Board } from '@/components/features/board/Board';
import { listLabels } from '@/services/labelService';
import { listPanels } from '@/services/panelService';
import { requireSession } from '@/services/sessionService';
import { listUsers } from '@/services/userService';
import DashboardLoading from './loading';

async function Dashboard() {
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
    />
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <Dashboard />
    </Suspense>
  );
}
