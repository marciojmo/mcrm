'use client';

import { useState, useTransition } from 'react';
import { renameBoard } from '@/app/(app)/dashboard/actions';
import { Input } from '@/components/ui/Input';

interface BoardNameEditorProps {
  boardId: string;
  boardName: string;
}

export function BoardNameEditor({ boardId, boardName }: BoardNameEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(boardName);
  const [isPending, startTransition] = useTransition();

  function startEditing() {
    setName(boardName);
    setIsEditing(true);
  }

  function save() {
    if (isPending) return;
    const trimmed = name.trim();
    if (!trimmed || trimmed === boardName) return setIsEditing(false);
    startTransition(async () => {
      await renameBoard(boardId, trimmed);
      setIsEditing(false);
    });
  }

  if (isEditing) {
    return (
      <Input
        autoFocus
        value={name}
        maxLength={200}
        aria-label="Nome do quadro"
        className="h-7 w-64"
        onChange={(event) => setName(event.target.value)}
        onFocus={(event) => event.target.select()}
        onBlur={save}
        onKeyDown={(event) => {
          if (event.key === 'Enter') save();
          if (event.key === 'Escape') setIsEditing(false);
        }}
      />
    );
  }

  return (
    <button
      type="button"
      className="cursor-text truncate rounded-md px-1 font-medium text-foreground hover:bg-muted"
      onClick={startEditing}
    >
      {boardName}
    </button>
  );
}
