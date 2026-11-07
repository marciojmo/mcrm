import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';

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
      className="flex items-center gap-1 text-sm text-muted-foreground"
    >
      <Link href="/dashboard" className="hover:text-foreground">
        Quadros
      </Link>
      <ChevronRightIcon className="size-4" />
      {isSettings ? (
        <>
          <Link
            href={`/dashboard/${boardId}`}
            className="hover:text-foreground"
          >
            {boardName}
          </Link>
          <ChevronRightIcon className="size-4" />
          <span className="font-medium text-foreground">Configurações</span>
        </>
      ) : (
        <span className="font-medium text-foreground">{boardName}</span>
      )}
    </nav>
  );
}
