import { cn } from '@/lib/utils';

interface UserStatusBadgeProps {
  isBanned: boolean;
}

export function UserStatusBadge({ isBanned }: UserStatusBadgeProps) {
  return (
    <span
      className={cn(
        'rounded-full px-2 py-0.5 text-xs font-medium',
        isBanned
          ? 'bg-destructive/10 text-destructive'
          : 'bg-muted text-muted-foreground'
      )}
    >
      {isBanned ? 'Desativado' : 'Ativo'}
    </span>
  );
}
