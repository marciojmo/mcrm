import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { formatShortDate } from '@/lib/formatShortDate';
import type { CollaboratorReport } from '@/types/admin';

interface UserIdentityHeaderProps {
  report: CollaboratorReport;
}

export function UserIdentityHeader({ report }: UserIdentityHeaderProps) {
  return (
    <header className="flex items-center gap-4">
      <Avatar size="lg">
        <AvatarImage src={report.image ?? undefined} alt={report.name} />
        <AvatarFallback>{report.name.slice(0, 1)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <p className="text-xl font-semibold">{report.name}</p>
        <p className="text-sm text-muted-foreground">
          {report.email} · desde {formatShortDate(report.joinedAt)} · último
          acesso{' '}
          {report.lastSeenAt ? formatShortDate(report.lastSeenAt) : 'nunca'}
        </p>
      </div>
    </header>
  );
}
