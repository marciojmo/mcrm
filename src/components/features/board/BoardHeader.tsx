import { SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import { BoardBackgroundPicker } from '@/components/features/board/BoardBackgroundPicker';
import { BoardBreadcrumb } from '@/components/features/board/BoardBreadcrumb';
import { buttonVariants } from '@/components/ui/Button';

interface BoardHeaderProps {
  boardId: string;
  boardName: string;
  background: string | null;
  canChangeBackground: boolean;
}

export function BoardHeader({
  boardId,
  boardName,
  background,
  canChangeBackground,
}: BoardHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 pt-4">
      <BoardBreadcrumb boardId={boardId} boardName={boardName} />
      <div className="flex items-center gap-2">
        {canChangeBackground && (
          <BoardBackgroundPicker boardId={boardId} background={background} />
        )}
        <Link
          href={`/dashboard/${boardId}/settings`}
          aria-label="Configurações"
          className={buttonVariants({ variant: 'outline', size: 'icon-sm' })}
        >
          <SettingsIcon />
        </Link>
      </div>
    </div>
  );
}
