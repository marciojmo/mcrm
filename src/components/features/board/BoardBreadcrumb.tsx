import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import { BoardNameEditor } from '@/components/features/board/BoardNameEditor';

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
  return (
    <nav
      aria-label="Caminho"
      className="flex min-w-0 items-center gap-1 text-sm text-muted-foreground"
    >
      <Link
        href="/dashboard"
        className="rounded-sm outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        Quadros
      </Link>
      <ChevronRightIcon className="size-4" />
      {isSettings ? (
        <>
          <Link
            href={`/dashboard/${boardId}`}
            className="rounded-sm outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {boardName}
          </Link>
          <ChevronRightIcon className="size-4" />
          <span className="font-medium text-foreground">Configurações</span>
        </>
      ) : (
        <BoardNameEditor boardId={boardId} boardName={boardName} />
      )}
    </nav>
  );
}
