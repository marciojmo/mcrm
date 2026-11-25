'use client';

import { useState } from 'react';
import {
  deactivateUser,
  reactivateUser,
} from '@/app/(admin)/admin/users/actions';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { useToast } from '@/components/ui/Toast';
import { useSafeTransition } from '@/hooks/useSafeTransition';

interface AccountStatusControlProps {
  userId: string;
  userName: string;
  isBanned: boolean;
  isCurrentUser: boolean;
}

export function AccountStatusControl({
  userId,
  userName,
  isBanned,
  isCurrentUser,
}: AccountStatusControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isPending, runAction } = useSafeTransition();
  const toast = useToast();

  async function deactivate() {
    const isDone = await runAction(() => deactivateUser(userId));
    if (!isDone) return;
    setIsOpen(false);
    toast.add({ title: 'Usuário desativado.' });
  }

  async function reactivate() {
    const isDone = await runAction(() => reactivateUser(userId));
    if (isDone) toast.add({ title: 'Usuário reativado.' });
  }

  return (
    <div className="flex flex-col gap-1.5">
      {isBanned ? (
        <Button
          variant="outline"
          className="self-start"
          disabled={isPending}
          onClick={reactivate}
        >
          Reativar usuário
        </Button>
      ) : (
        <Button
          variant="destructive"
          className="self-start"
          disabled={isCurrentUser}
          onClick={() => setIsOpen(true)}
        >
          Desativar usuário
        </Button>
      )}
      {isCurrentUser && (
        <p className="text-xs text-muted-foreground">
          Você não pode desativar a própria conta.
        </p>
      )}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Desativar &ldquo;{userName}&rdquo;?</DialogTitle>
            <DialogDescription>
              O usuário não poderá entrar e suas sessões serão encerradas. Nada
              será apagado e você pode reativar a conta quando quiser.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={isPending}
              aria-busy={isPending}
              onClick={deactivate}
            >
              {isPending ? 'Desativando…' : 'Desativar usuário'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
