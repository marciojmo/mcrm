'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  changeUserRole,
  resetUserPassword,
} from '@/app/(admin)/admin/users/actions';
import { UserAvatar } from '@/components/features/board/UserAvatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '@/constants/auth';
import { ROLE_SELECT_CLASS } from '@/constants/userRole';
import { useSafeTransition } from '@/hooks/useSafeTransition';
import type { AccountUser, UserRole } from '@/types/accountUser';

interface UserAccountRowProps {
  user: AccountUser;
  isCurrentUser: boolean;
}

export function UserAccountRow({ user, isCurrentUser }: UserAccountRowProps) {
  const [password, setPassword] = useState('');
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);
  const { isPending, runAction } = useSafeTransition();
  const toast = useToast();

  async function confirmRole() {
    if (!pendingRole) return;
    const isChanged = await runAction(() =>
      changeUserRole(user.id, pendingRole)
    );
    if (!isChanged) return;
    setPendingRole(null);
    toast.add({ title: 'Papel atualizado.' });
  }

  async function resetPassword(event: React.FormEvent) {
    event.preventDefault();
    const isReset = await runAction(() => resetUserPassword(user.id, password));
    if (!isReset) return;
    setPassword('');
    toast.add({ title: 'Senha redefinida.' });
  }

  return (
    <tr className="border-t">
      <td className="px-3 py-2">
        <Link
          href={`/admin/users/${user.id}`}
          className="flex items-center gap-2"
        >
          <UserAvatar user={user} isDecorative />
          <span className="flex min-w-0 flex-col">
            <span className="truncate font-medium">{user.name}</span>
            <span className="truncate text-xs text-muted-foreground">
              {user.email}
            </span>
          </span>
        </Link>
      </td>
      <td className="px-3 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label={`Papel de ${user.name}`}
            title={
              isCurrentUser
                ? 'Você não pode alterar o próprio papel'
                : undefined
            }
            className={ROLE_SELECT_CLASS}
            value={pendingRole ?? user.role}
            disabled={isPending || isCurrentUser}
            onChange={(event) =>
              setPendingRole(
                event.target.value === user.role
                  ? null
                  : (event.target.value as UserRole)
              )
            }
          >
            <option value="user">Usuário</option>
            <option value="admin">Administrador</option>
          </select>
          {isCurrentUser && (
            <span className="text-xs text-muted-foreground">(você)</span>
          )}
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
      </td>
      <td className="px-3 py-2 text-muted-foreground">
        {user.isGoogleLinked ? 'Vinculado' : '—'}
      </td>
      <td className="px-3 py-2">
        <form onSubmit={resetPassword} className="flex items-center gap-2">
          <Input
            required
            type="password"
            autoComplete="new-password"
            aria-label={`Nova senha de ${user.name}`}
            placeholder={`Nova senha (mín. ${MIN_PASSWORD_LENGTH})`}
            minLength={MIN_PASSWORD_LENGTH}
            maxLength={MAX_PASSWORD_LENGTH}
            className="w-48"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button type="submit" size="sm" disabled={isPending}>
            Redefinir
          </Button>
        </form>
      </td>
    </tr>
  );
}
