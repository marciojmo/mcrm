'use client';

import { archiveBoard } from '@/app/(app)/dashboard/actions';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { ARCHIVE_ERROR_MESSAGE } from '@/constants/errorMessages';
import { useSafeTransition } from '@/hooks/useSafeTransition';

interface ArchiveBoardDialogProps {
  boardId: string;
  boardName: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ArchiveBoardDialog({
  boardId,
  boardName,
  isOpen,
  onOpenChange,
}: ArchiveBoardDialogProps) {
  const { isPending, runAction } = useSafeTransition();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Arquivar quadro &ldquo;{boardName}&rdquo;?</DialogTitle>
          <DialogDescription>
            O quadro e suas tarefas deixarão de aparecer para todos os
            participantes.
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
            onClick={() =>
              runAction(() => archiveBoard(boardId), {
                errorMessage: ARCHIVE_ERROR_MESSAGE,
              })
            }
          >
            {isPending ? 'Arquivando…' : 'Arquivar quadro'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
