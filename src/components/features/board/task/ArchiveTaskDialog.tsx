'use client';

import { useTransition } from 'react';
import { archiveTask } from '@/app/(app)/dashboard/actions';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';

interface ArchiveTaskDialogProps {
  taskId: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onArchived: () => void;
}

export function ArchiveTaskDialog({
  taskId,
  isOpen,
  onOpenChange,
  onArchived,
}: ArchiveTaskDialogProps) {
  const [isPending, startTransition] = useTransition();

  function confirm() {
    startTransition(async () => {
      await archiveTask(taskId);
      onArchived();
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Arquivar tarefa?</DialogTitle>
          <DialogDescription>
            A tarefa deixará de aparecer no quadro.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button disabled={isPending} onClick={confirm}>
            Arquivar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
