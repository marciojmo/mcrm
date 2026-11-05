'use client';

import { useTransition } from 'react';
import { archivePanel } from '@/app/(app)/dashboard/actions';
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

interface ArchivePanelDialogProps {
  panel: BoardPanel;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ArchivePanelDialog({
  panel,
  isOpen,
  onOpenChange,
}: ArchivePanelDialogProps) {
  const [isPending, startTransition] = useTransition();
  const taskCount = panel.tasks.length;

  function confirm() {
    startTransition(async () => {
      await archivePanel(panel.id);
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Arquivar painel &ldquo;{panel.name}&rdquo;?</DialogTitle>
          <DialogDescription>
            {taskCount > 0
              ? `Atenção: este painel tem ${taskCount} ${taskCount === 1 ? 'tarefa' : 'tarefas'}, que também deixarão de aparecer no quadro.`
              : 'O painel deixará de aparecer no quadro.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" disabled={isPending} onClick={confirm}>
            Arquivar painel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
