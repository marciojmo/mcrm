import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Board } from '@/components/features/board/Board';
import { getBoard } from '@/services/boardService';
import { listLabels } from '@/services/labelService';
import { listPanels } from '@/services/panelService';
import { requireSession } from '@/services/sessionService';
import { listUsers } from '@/services/userService';
import DashboardLoading from '../loading';

async function BoardView({
  params,
  searchParams,
}: {
  params: PageProps<'/dashboard/[boardId]'>['params'];
  searchParams: PageProps<'/dashboard/[boardId]'>['searchParams'];
}) {
  const { boardId } = await params;
  const { task, comment } = await searchParams;
  const { user } = await requireSession();
  const [board, panels, users, labels] = await Promise.all([
    getBoard(boardId, user.id),
    listPanels(boardId),
    listUsers(),
    listLabels(),
  ]);
  if (!board) notFound();
  return (
    <Board
      boardId={board.id}
      boardName={board.name}
      panels={panels}
      users={users}
      labels={labels}
      currentUserId={user.id}
      initialTaskId={typeof task === 'string' ? task : null}
      highlightCommentId={typeof comment === 'string' ? comment : null}
    />
  );
}

export default function BoardPage({
  params,
  searchParams,
}: PageProps<'/dashboard/[boardId]'>) {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <BoardView params={params} searchParams={searchParams} />
    </Suspense>
  );
}
