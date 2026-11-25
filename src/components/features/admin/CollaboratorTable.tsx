import Link from 'next/link';
import { UserAvatar } from '@/components/features/board/UserAvatar';
import { formatShortDate } from '@/lib/formatShortDate';
import { cn } from '@/lib/utils';
import type { CollaboratorSummary } from '@/types/admin';

const COLUMNS = [
  'Colaborador',
  'Abertas',
  'Atrasadas',
  'Concluídas',
  'Pontos',
  'Último acesso',
];

interface CollaboratorTableProps {
  collaborators: CollaboratorSummary[];
}

export function CollaboratorTable({ collaborators }: CollaboratorTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted/60 text-left text-xs text-muted-foreground">
          <tr>
            {COLUMNS.map((column, index) => (
              <th
                key={column}
                className={cn(
                  'px-3 py-2 font-medium',
                  index > 0 && 'text-right'
                )}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {collaborators.map(({ stats, ...collaborator }) => (
            <tr key={collaborator.id} className="border-t hover:bg-muted/40">
              <td className="px-3 py-2">
                <Link
                  href={`/admin/metrics/${collaborator.id}`}
                  className="flex items-center gap-2"
                >
                  <UserAvatar user={collaborator} isDecorative />
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate font-medium">
                      {collaborator.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {collaborator.email}
                    </span>
                  </span>
                </Link>
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {stats.openCount}
              </td>
              <td
                className={cn(
                  'px-3 py-2 text-right tabular-nums',
                  stats.overdueCount > 0 && 'text-destructive'
                )}
              >
                {stats.overdueCount}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {stats.completedCount}
              </td>
              <td className="px-3 py-2 text-right font-medium tabular-nums">
                {stats.score}
              </td>
              <td className="px-3 py-2 text-right text-muted-foreground">
                {collaborator.lastSeenAt
                  ? formatShortDate(collaborator.lastSeenAt)
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
