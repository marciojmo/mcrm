'use client';

import { useTransition } from 'react';
import { deleteAttachment } from '@/app/(app)/dashboard/taskActions';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';

interface DeleteAttachmentDialogProps {
  attachmentId: string;
  name: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onDeleted: () => Promise<void>;
}

export function DeleteAttachmentDialog({
  attachmentId,
  name,
  isOpen,
  onOpenChange,
  onDeleted,
}: DeleteAttachmentDialogProps) {
  const [isPending, startTransition] = useTransition();

  function confirm() {
    startTransition(async () => {
      await deleteAttachment(attachmentId);
      await onDeleted();
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir anexo?</DialogTitle>
          <DialogDescription>
            &ldquo;{name}&rdquo; será removido da tarefa. Essa ação não pode ser
            desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" disabled={isPending} onClick={confirm}>
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
