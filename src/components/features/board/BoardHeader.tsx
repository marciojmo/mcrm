import { SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import { BoardBackgroundPicker } from '@/components/features/board/BoardBackgroundPicker';
import { BoardBreadcrumb } from '@/components/features/board/BoardBreadcrumb';
import { buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface BoardHeaderProps {
  boardId: string;
  boardName: string;
  background: string | null;
  canChangeBackground: boolean;
  hasBackground: boolean;
}

export function BoardHeader({
  boardId,
  boardName,
  background,
  canChangeBackground,
  hasBackground,
}: BoardHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 pt-4">
      <div
        className={cn(
          'min-w-0',
          hasBackground && 'flex h-9 items-center rounded-lg bg-background px-3'
        )}
      >
        <BoardBreadcrumb boardId={boardId} boardName={boardName} />
      </div>
      <div
        className={cn(
          'flex items-center gap-2',
          hasBackground && 'rounded-lg bg-background p-1'
        )}
      >
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
