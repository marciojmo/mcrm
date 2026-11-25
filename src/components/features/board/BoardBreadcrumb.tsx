import { BoardNameEditor } from '@/components/features/board/BoardNameEditor';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

interface BoardBreadcrumbProps {
  boardId: string;
  boardName: string;
  isSettings?: boolean;
}

export function BoardBreadcrumb({
  boardId,
  boardName,
  isSettings = false,
}: BoardBreadcrumbProps) {
  const boardsLink = { label: 'Quadros', href: '/dashboard' };
  return isSettings ? (
    <Breadcrumb
      links={[boardsLink, { label: boardName, href: `/dashboard/${boardId}` }]}
    >
      <span className="font-medium text-foreground">Configurações</span>
    </Breadcrumb>
  ) : (
    <Breadcrumb links={[boardsLink]}>
      <BoardNameEditor boardId={boardId} boardName={boardName} />
    </Breadcrumb>
  );
}
