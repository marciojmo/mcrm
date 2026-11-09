import Link from 'next/link';
import { ArrowLeftIcon, StarIcon } from 'lucide-react';
import { DeadlineList } from '@/components/features/home/DeadlineList';
import { NotificationList } from '@/components/features/home/NotificationList';
import { StatCard } from '@/components/features/home/StatCard';
import { TaskCountsCard } from '@/components/features/home/TaskCountsCard';
import { TopScorersCard } from '@/components/features/home/TopScorersCard';
import { buttonVariants } from '@/components/ui/Button';
import { formatLongDate } from '@/lib/formatLongDate';
import type { HomeOverview as HomeOverviewData, HomeView } from '@/types/home';

interface SectionProps {
  title: string;
  seeAllHref?: string;
  children: React.ReactNode;
}

function Section({ title, seeAllHref, children }: SectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex max-w-xl items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        {seeAllHref && (
          <Link
            href={seeAllHref}
            className={buttonVariants({ variant: 'ghost', size: 'xs' })}
          >
            Ver todas
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

interface HomeOverviewProps {
  overview: HomeOverviewData;
  today: string;
  view: HomeView;
}

export function HomeOverview({ overview, today, view }: HomeOverviewProps) {
  if (view !== 'overview') {
    const isNotifications = view === 'notifications';
    return (
      <div className="flex flex-col gap-6 overflow-y-auto p-6">
        <Link
          href="/home"
          className={buttonVariants({
            variant: 'ghost',
            size: 'sm',
            className: 'self-start',
          })}
        >
          <ArrowLeftIcon /> Voltar ao início
        </Link>
        <Section title={isNotifications ? 'Notificações' : 'Prazos'}>
          {isNotifications ? (
            <NotificationList mentions={overview.mentions} />
          ) : (
            <DeadlineList deadlines={overview.deadlines} today={today} />
          )}
        </Section>
      </div>
    );
  }

  const { stats } = overview;
  return (
    <div className="flex flex-col gap-8 overflow-y-auto p-6">
      <header>
        <h1 className="text-xl font-semibold">
          Boas-vindas, {overview.userName}!
        </h1>
        <p className="text-sm text-muted-foreground">
          hoje é {formatLongDate(today)}
        </p>
      </header>
      <div className="flex flex-wrap gap-3">
        <TaskCountsCard stats={stats} />
        <StatCard
          icon={StarIcon}
          value={stats.score}
          label="Sua pontuação"
          hint="+10 concluída · +1 em aberto · −5 em atraso"
          isHighlighted
        />
        <TopScorersCard scorers={overview.topScorers} />
      </div>
      <Section title="Prazos mais apertados" seeAllHref="/home?view=deadlines">
        <DeadlineList deadlines={overview.deadlines} today={today} />
      </Section>
      <Section title="Notificações" seeAllHref="/home?view=notifications">
        <NotificationList mentions={overview.mentions} />
      </Section>
    </div>
  );
}
