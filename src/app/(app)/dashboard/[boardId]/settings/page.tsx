import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { BoardBreadcrumb } from '@/components/features/board/BoardBreadcrumb';
import { BoardSettings } from '@/components/features/board/BoardSettings';
import { getBoard, listBoardMembers } from '@/services/boardService';
import { requireSession } from '@/services/sessionService';
import { listUsers } from '@/services/userService';
import DashboardLoading from '../../loading';

async function Settings({
  params,
}: {
  params: PageProps<'/dashboard/[boardId]/settings'>['params'];
}) {
  const { boardId } = await params;
  const { user } = await requireSession();
  const [board, members, users] = await Promise.all([
    getBoard(boardId, user.id),
    listBoardMembers(boardId),
    listUsers(),
  ]);
  if (!board) notFound();
  const memberIds = new Set(members.map((member) => member.id));
  return (
    <div className="flex flex-col gap-6 p-4">
      <BoardBreadcrumb boardId={board.id} boardName={board.name} isSettings />
      <BoardSettings
        boardId={board.id}
        boardName={board.name}
        members={members}
        candidates={users.filter((candidate) => !memberIds.has(candidate.id))}
        isOwner={board.ownerId === user.id}
        ownerId={board.ownerId}
      />
    </div>
  );
}

export default function BoardSettingsPage({
  params,
}: PageProps<'/dashboard/[boardId]/settings'>) {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <Settings params={params} />
    </Suspense>
  );
}
