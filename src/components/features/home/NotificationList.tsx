import Link from 'next/link';
import { UserAvatar } from '@/components/features/board/UserAvatar';
import { MarkMentionSeenButton } from '@/components/features/home/MarkMentionSeenButton';
import { cn } from '@/lib/utils';
import type { HomeMention } from '@/types/home';

export function NotificationList({ mentions }: { mentions: HomeMention[] }) {
  if (mentions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Ninguém mencionou você ainda.
      </p>
    );
  }
  return (
    <ul className="flex max-w-xl flex-col gap-2">
      {mentions.map((mention) => (
        <li
          key={mention.id}
          className={cn(
            'flex items-center gap-1 rounded-lg bg-card pr-2 ring-1 ring-foreground/10',
            mention.isSeen && 'opacity-60'
          )}
        >
          <Link
            href={`/dashboard?task=${mention.taskId}&comment=${mention.id}`}
            className="flex min-w-0 flex-1 gap-3 rounded-lg p-3 text-sm hover:bg-muted"
          >
            <UserAvatar user={mention.author} />
            <span className="flex min-w-0 flex-col gap-0.5">
              <span>
                <span className="font-medium">{mention.author.name}</span>{' '}
                mencionou você em{' '}
                <span className="font-medium">{mention.taskTitle}</span>
              </span>
              <span className="truncate text-muted-foreground">
                {mention.body}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(mention.createdAt).toLocaleString('pt-BR')}
              </span>
            </span>
          </Link>
          {!mention.isSeen && <MarkMentionSeenButton commentId={mention.id} />}
        </li>
      ))}
    </ul>
  );
}
