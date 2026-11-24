'use client';

import type { RefObject } from 'react';
import { archivePanelTasks } from '@/app/(app)/dashboard/actions';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import type { BoardPanel } from '@/types/board';
import { ARCHIVE_ERROR_MESSAGE } from '@/constants/errorMessages';
import { useSafeTransition } from '@/hooks/useSafeTransition';

interface ArchivePanelTasksDialogProps {
  panel: BoardPanel;
  taskCount: number;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  finalFocus: RefObject<HTMLElement | null>;
}

export function ArchivePanelTasksDialog({
  panel,
  taskCount,
  isOpen,
  onOpenChange,
  finalFocus,
}: ArchivePanelTasksDialogProps) {
  const { isPending, runAction } = useSafeTransition();
  const cardLabel = taskCount === 1 ? 'cartão' : 'cartões';
  const verb = taskCount === 1 ? 'deixará' : 'deixarão';

  function confirm() {
    runAction(
      async () => {
        await archivePanelTasks(panel.id);
        onOpenChange(false);
      },
      { errorMessage: ARCHIVE_ERROR_MESSAGE }
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent finalFocus={finalFocus}>
        <DialogHeader>
          <DialogTitle>
            Arquivar todos os cartões de &ldquo;{panel.name}&rdquo;?
          </DialogTitle>
          <DialogDescription>
            {`${taskCount} ${cardLabel} ${verb} de aparecer no quadro. O painel continua.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            disabled={isPending}
            aria-busy={isPending}
            onClick={confirm}
          >
            {isPending ? 'Arquivando…' : `Arquivar ${taskCount} ${cardLabel}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
