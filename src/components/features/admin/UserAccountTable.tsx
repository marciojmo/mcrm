import { UserAccountRow } from '@/components/features/admin/UserAccountRow';
import type { AccountUser } from '@/types/accountUser';

const COLUMNS = ['Usuário', 'Papel', 'Google', 'Senha'];

interface UserAccountTableProps {
  users: AccountUser[];
  currentUserId: string;
}

export function UserAccountTable({
  users,
  currentUserId,
}: UserAccountTableProps) {
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
            <UserAccountRow
              key={user.id}
              user={user}
              isCurrentUser={user.id === currentUserId}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
