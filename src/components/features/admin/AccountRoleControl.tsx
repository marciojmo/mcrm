'use client';

import { useState } from 'react';
import { changeUserRole } from '@/app/(admin)/admin/users/actions';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { ROLE_SELECT_CLASS } from '@/constants/userRole';
import { useSafeTransition } from '@/hooks/useSafeTransition';
import type { UserRole } from '@/types/accountUser';

interface AccountRoleControlProps {
  userId: string;
  role: UserRole;
  isCurrentUser: boolean;
}

export function AccountRoleControl({
  userId,
  role,
  isCurrentUser,
}: AccountRoleControlProps) {
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);
  const { isPending, runAction } = useSafeTransition();
  const toast = useToast();

  async function confirmRole() {
    if (!pendingRole) return;
    const isChanged = await runAction(() =>
      changeUserRole(userId, pendingRole)
    );
    if (!isChanged) return;
    setPendingRole(null);
    toast.add({ title: 'Papel atualizado.' });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="account-role" className="text-sm font-medium">
        Papel
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <select
          id="account-role"
          className={ROLE_SELECT_CLASS}
          value={pendingRole ?? role}
          disabled={isPending || isCurrentUser}
          onChange={(event) =>
            setPendingRole(
              event.target.value === role
                ? null
                : (event.target.value as UserRole)
            )
          }
        >
          <option value="user">Usuário</option>
          <option value="admin">Administrador</option>
        </select>
        {pendingRole && (
          <>
            <Button size="sm" disabled={isPending} onClick={confirmRole}>
              Confirmar
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={isPending}
              onClick={() => setPendingRole(null)}
            >
              Cancelar
            </Button>
          </>
        )}
      </div>
      {isCurrentUser && (
        <p className="text-xs text-muted-foreground">
          Você não pode alterar o próprio papel.
        </p>
      )}
    </div>
  );
}
