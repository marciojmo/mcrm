'use client';

import { useState, useTransition } from 'react';
import { addBoardMember } from '@/app/(app)/dashboard/actions';
import { UserAvatar } from '@/components/features/board/UserAvatar';
import { Input } from '@/components/ui/Input';
import type { BoardUser } from '@/types/board';

interface AddBoardMemberSearchProps {
  boardId: string;
  candidates: BoardUser[];
}

export function AddBoardMemberSearch({
  boardId,
  candidates,
}: AddBoardMemberSearchProps) {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const term = query.trim().toLowerCase();
  const matches = term
    ? candidates.filter((candidate) =>
        candidate.name.toLowerCase().includes(term)
      )
    : [];

  function add(userId: string) {
    startTransition(async () => {
      await addBoardMember(boardId, userId);
      setQuery('');
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <Input
        value={query}
        placeholder="Buscar usuário pelo nome"
        disabled={isPending}
        onChange={(event) => setQuery(event.target.value)}
      />
      {term && (
        <ul className="flex max-h-64 flex-col overflow-y-auto rounded-lg ring-1 ring-foreground/10">
          {matches.length === 0 && (
            <li className="px-2 py-1.5 text-sm text-muted-foreground">
              Nenhum usuário encontrado
            </li>
          )}
          {matches.map((candidate) => (
            <li key={candidate.id}>
              <button
                type="button"
                disabled={isPending}
                className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-sm hover:bg-muted disabled:opacity-50"
                onClick={() => add(candidate.id)}
              >
                <UserAvatar user={candidate} />
                <span className="flex-1 truncate">{candidate.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
