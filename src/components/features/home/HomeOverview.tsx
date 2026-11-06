import Link from 'next/link';
import { MarkMentionSeenButton } from '@/components/features/home/MarkMentionSeenButton';
import { UserAvatar } from '@/components/features/board/UserAvatar';
import { formatDueDate } from '@/lib/formatDueDate';
import { cn } from '@/lib/utils';
import type { HomeOverview as HomeOverviewData } from '@/types/home';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function EmptyText({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

export function HomeOverview({
  overview,
  today,
}: {
  overview: HomeOverviewData;
  today: string;
}) {
  return (
    <div className="flex flex-col gap-8 overflow-y-auto p-6">
      <h1 className="text-xl font-semibold">Início</h1>
      <div className="grid max-w-md grid-cols-2 gap-3">
        <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
          <p className="text-3xl font-semibold">{overview.pendingCount}</p>
          <p className="text-sm text-muted-foreground">Tarefas pendentes</p>
        </div>
        <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
          <p className="text-3xl font-semibold">{overview.completedCount}</p>
          <p className="text-sm text-muted-foreground">Tarefas concluídas</p>
        </div>
      </div>
      <Section title="Prazos mais apertados">
        {overview.deadlines.length === 0 ? (
          <EmptyText>Nenhuma tarefa pendente com prazo.</EmptyText>
        ) : (
          <ul className="flex max-w-xl flex-col gap-2">
            {overview.deadlines.map((task) => (
              <li key={task.id}>
                <Link
                  href={`/dashboard?task=${task.id}`}
                  className="flex items-center justify-between gap-3 rounded-lg bg-card p-3 text-sm ring-1 ring-foreground/10 hover:bg-muted"
                >
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate font-medium">{task.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {task.panelName}
                    </span>
                  </span>
                  <span
                    className={cn(
                      'shrink-0 text-xs',
                      task.dueDate < today
                        ? 'font-medium text-destructive'
                        : 'text-muted-foreground'
                    )}
                  >
                    {task.dueDate < today && 'Vencida · '}
                    {formatDueDate(task.dueDate)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>
      <Section title="Menções">
        {overview.mentions.length === 0 ? (
          <EmptyText>Ninguém mencionou você ainda.</EmptyText>
        ) : (
          <ul className="flex max-w-xl flex-col gap-2">
            {overview.mentions.map((mention) => (
              <li
                key={mention.id}
                className="flex items-center gap-1 rounded-lg bg-card pr-2 ring-1 ring-foreground/10"
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
                <MarkMentionSeenButton commentId={mention.id} />
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
