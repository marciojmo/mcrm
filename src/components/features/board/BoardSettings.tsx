'use client';

import { useState, useTransition } from 'react';
import { addBoardMember } from '@/app/(app)/dashboard/actions';
import { ArchiveBoardDialog } from '@/components/features/board/ArchiveBoardDialog';
import { UserAvatar } from '@/components/features/board/UserAvatar';
import { Button } from '@/components/ui/Button';
import type { BoardUser } from '@/types/board';

interface BoardSettingsProps {
  boardId: string;
  boardName: string;
  ownerId: string;
  members: BoardUser[];
  candidates: BoardUser[];
  isOwner: boolean;
}

export function BoardSettings({
  boardId,
  boardName,
  ownerId,
  members,
  candidates,
  isOwner,
}: BoardSettingsProps) {
  const [isArchiving, setIsArchiving] = useState(false);
  const [isPending, startTransition] = useTransition();

  function add(userId: string) {
    startTransition(() => addBoardMember(boardId, userId));
  }

  return (
    <div className="flex max-w-xl flex-col gap-8">
      <section className="flex flex-col gap-2">
        <h2 className="text-base font-semibold">Membros</h2>
        <ul className="flex flex-col gap-2">
          {members.map((member) => (
            <li key={member.id} className="flex items-center gap-2 text-sm">
              <UserAvatar user={member} />
              {member.name}
              {member.id === ownerId && (
                <span className="text-muted-foreground">(dono)</span>
              )}
            </li>
          ))}
        </ul>
      </section>
      {isOwner && (
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-semibold">Adicionar membro</h2>
          {candidates.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Todos os usuários já participam deste quadro.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {candidates.map((candidate) => (
                <li
                  key={candidate.id}
                  className="flex items-center gap-2 text-sm"
                >
                  <UserAvatar user={candidate} />
                  <span className="flex-1">{candidate.name}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => add(candidate.id)}
                  >
                    Adicionar
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
      {isOwner && (
        <section className="flex flex-col items-start gap-2">
          <h2 className="text-base font-semibold">Arquivar quadro</h2>
          <p className="text-sm text-muted-foreground">
            O quadro deixará de aparecer para todos os membros.
          </p>
          <Button variant="destructive" onClick={() => setIsArchiving(true)}>
            Arquivar quadro
          </Button>
          <ArchiveBoardDialog
            boardId={boardId}
            boardName={boardName}
            isOpen={isArchiving}
            onOpenChange={setIsArchiving}
          />
        </section>
      )}
    </div>
  );
}
