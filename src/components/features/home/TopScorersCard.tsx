import { TrophyIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TopScorer } from '@/types/home';

export function TopScorersCard({ scorers }: { scorers: TopScorer[] }) {
  return (
    <div className="flex min-w-48 flex-col gap-2 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
      <TrophyIcon className="size-4 text-muted-foreground" />
      {scorers.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sem pontuações ainda.</p>
      ) : (
        <ol className="flex flex-col gap-1.5 text-sm">
          {scorers.map((scorer, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="w-4 text-muted-foreground tabular-nums">
                {index + 1}º
              </span>
              <span className="flex-1 truncate font-medium">{scorer.name}</span>
              <span
                className={cn(
                  'font-semibold tabular-nums',
                  scorer.score < 0 && 'text-destructive'
                )}
              >
                {scorer.score}
              </span>
            </li>
          ))}
        </ol>
      )}
      <p className="mt-auto text-sm text-muted-foreground">
        Melhores pontuações
      </p>
    </div>
  );
}
