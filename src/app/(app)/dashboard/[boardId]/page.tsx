import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Board } from '@/components/features/board/Board';
import { getMaxUploadBytes } from '@/services/appSettingService';
import { getBoard, listBoardMembers } from '@/services/boardService';
import { listLabels } from '@/services/labelService';
import { listPanels } from '@/services/panelService';
import { isAdminUser, requireSession } from '@/services/sessionService';
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
  const board = await getBoard(boardId, user.id);
  if (!board) notFound();
  const [panels, users, labels, maxUploadBytes] = await Promise.all([
    listPanels(boardId),
    listBoardMembers(boardId),
    listLabels(boardId),
    getMaxUploadBytes(),
  ]);
  return (
    <Board
      boardId={board.id}
      boardName={board.name}
      background={board.background}
      canChangeBackground={board.ownerId === user.id || isAdminUser(user)}
      panels={panels}
      users={users}
      labels={labels}
      maxUploadBytes={maxUploadBytes}
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
