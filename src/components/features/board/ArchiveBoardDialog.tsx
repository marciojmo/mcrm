'use client';

import { useTransition } from 'react';
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
  const [isPending, startTransition] = useTransition();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Arquivar quadro &ldquo;{boardName}&rdquo;?</DialogTitle>
          <DialogDescription>
            O quadro e suas tarefas deixarão de aparecer para todos os membros.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => startTransition(() => archiveBoard(boardId))}
          >
            Arquivar quadro
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
