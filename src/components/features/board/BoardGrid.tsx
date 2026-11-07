'use client';

import { useState, useTransition } from 'react';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { createBoard } from '@/app/(app)/dashboard/actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { BoardSummary } from '@/types/board';

const CARD_CLASS =
  'flex h-24 items-center rounded-xl bg-muted/60 p-4 text-sm font-medium';

interface BoardGridProps {
  boards: BoardSummary[];
}

export function BoardGrid({ boards }: BoardGridProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [isPending, startTransition] = useTransition();

  function close() {
    setName('');
    setIsCreating(false);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    startTransition(() => createBoard(name));
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-3 p-4">
      {boards.map((board) => (
        <Link
          key={board.id}
          href={`/dashboard/${board.id}`}
          className={`${CARD_CLASS} hover:bg-muted`}
        >
          <span className="truncate">{board.name}</span>
        </Link>
      ))}
      {isCreating ? (
        <form onSubmit={submit} className={`${CARD_CLASS} flex-col gap-2`}>
          <Input
            autoFocus
            value={name}
            placeholder="Nome do quadro"
            maxLength={200}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => event.key === 'Escape' && close()}
          />
          <div className="flex gap-2 self-start">
            <Button type="submit" size="sm" disabled={isPending}>
              Criar
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={close}>
              Cancelar
            </Button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className={`${CARD_CLASS} gap-1.5 text-muted-foreground hover:bg-muted`}
        >
          <PlusIcon className="size-4" /> Novo quadro
        </button>
      )}
    </div>
  );
}
