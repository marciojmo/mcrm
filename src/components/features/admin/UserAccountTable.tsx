import Link from 'next/link';
import { UserStatusBadge } from '@/components/features/admin/UserStatusBadge';
import { UserAvatar } from '@/components/features/board/UserAvatar';
import { cn } from '@/lib/utils';
import type { AccountUser } from '@/types/accountUser';

const COLUMNS = ['Usuário', 'Papel', 'Google', 'Status'];

interface UserAccountTableProps {
  users: AccountUser[];
}

export function UserAccountTable({ users }: UserAccountTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted/60 text-left text-xs text-muted-foreground">
          <tr>
            {COLUMNS.map((column) => (
              <th key={column} className="px-3 py-2 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="px-3 py-2">
                <Link
                  href={`/admin/users/${user.id}`}
                  className="flex items-center gap-2"
                >
                  <UserAvatar user={user} isDecorative />
                  <span className="flex min-w-0 flex-col">
                    <span
                      className={cn(
                        'truncate font-medium',
                        user.isBanned && 'text-muted-foreground'
                      )}
                    >
                      {user.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </span>
                </Link>
              </td>
              <td className="px-3 py-2">
                {user.role === 'admin' ? 'Administrador' : 'Usuário'}
              </td>
              <td className="px-3 py-2 text-muted-foreground">
                {user.isGoogleLinked ? 'Vinculado' : '—'}
              </td>
              <td className="px-3 py-2">
                <UserStatusBadge isBanned={user.isBanned} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
