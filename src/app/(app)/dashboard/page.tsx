import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { BoardGrid } from '@/components/features/board/BoardGrid';
import { getTaskBoardId, listBoards } from '@/services/boardService';
import { requireSession } from '@/services/sessionService';
import DashboardLoading from './loading';

async function Boards({
  searchParams,
}: {
  searchParams: PageProps<'/dashboard'>['searchParams'];
}) {
  const { task, comment } = await searchParams;
  const taskId = typeof task === 'string' ? task : null;
  const boardId = taskId && (await getTaskBoardId(taskId));
  if (boardId) {
    const query = new URLSearchParams({ task: taskId });
    if (typeof comment === 'string') query.set('comment', comment);
    redirect(`/dashboard/${boardId}?${query}`);
  }
  const { user } = await requireSession();
  return <BoardGrid boards={await listBoards(user.id)} />;
}

export default function DashboardPage({
  searchParams,
}: PageProps<'/dashboard'>) {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <Boards searchParams={searchParams} />
    </Suspense>
  );
}
