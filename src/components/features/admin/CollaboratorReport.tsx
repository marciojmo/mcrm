import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  CircleDotIcon,
  MessageSquareIcon,
  TrophyIcon,
} from 'lucide-react';
import { CollaboratorTaskList } from '@/components/features/admin/CollaboratorTaskList';
import { StatCard } from '@/components/features/home/StatCard';
import { cn } from '@/lib/utils';
import type { CollaboratorReport as Report } from '@/types/admin';

interface CollaboratorReportProps {
  report: Report;
  today: string;
}

export function CollaboratorReport({ report, today }: CollaboratorReportProps) {
  const { stats } = report;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-3">
        <StatCard
          icon={CircleDotIcon}
          value={stats.openCount}
          label="Abertas"
        />
        <StatCard
          icon={AlertTriangleIcon}
          value={stats.overdueCount}
          label="Atrasadas"
        />
        <StatCard
          icon={CheckCircle2Icon}
          value={stats.completedCount}
          label="Concluídas"
          hint={`${report.completedLast30Days} nos últimos 30 dias`}
        />
        <StatCard
          icon={MessageSquareIcon}
          value={report.commentsLast30Days}
          label="Comentários"
          hint="nos últimos 30 dias"
        />
        <StatCard
          icon={TrophyIcon}
          value={stats.score}
          label="Pontos"
          isHighlighted
        />
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium">Por quadro</h2>
        {report.boards.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma tarefa atribuída.
          </p>
        ) : (
          <ul className="divide-y rounded-md border text-sm">
            {report.boards.map((board) => (
              <li key={board.id} className="flex items-center gap-4 px-3 py-2">
                <span className="min-w-0 flex-1 truncate font-medium">
                  {board.name}
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {board.stats.openCount} abertas ·{' '}
                  <span
                    className={cn(
                      board.stats.overdueCount > 0 && 'text-destructive'
                    )}
                  >
                    {board.stats.overdueCount} atrasadas
                  </span>{' '}
                  · {board.stats.completedCount} concluídas
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <CollaboratorTaskList
        title="Tarefas em aberto"
        tasks={report.openTasks}
        today={today}
        emptyMessage="Nenhuma tarefa em aberto."
      />
      <CollaboratorTaskList
        title="Concluídas recentemente"
        tasks={report.recentlyCompleted}
        today={today}
        emptyMessage="Nenhuma tarefa concluída."
      />
    </div>
  );
}
