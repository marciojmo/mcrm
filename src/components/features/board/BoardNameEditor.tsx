'use client';

import { useEffect, useRef, useState } from 'react';
import { renameBoard } from '@/app/(app)/dashboard/actions';
import { Input } from '@/components/ui/Input';
import { useSafeTransition } from '@/hooks/useSafeTransition';

interface BoardNameEditorProps {
  boardId: string;
  boardName: string;
}

export function BoardNameEditor({ boardId, boardName }: BoardNameEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(boardName);
  const { isPending, runAction } = useSafeTransition();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const hasEdited = useRef(false);

  useEffect(() => {
    if (isEditing) hasEdited.current = true;
    else if (hasEdited.current && document.activeElement === document.body)
      buttonRef.current?.focus();
  }, [isEditing]);

  function startEditing() {
    setName(boardName);
    setIsEditing(true);
  }

  function save() {
    if (isPending) return;
    const trimmed = name.trim();
    if (!trimmed || trimmed === boardName) return setIsEditing(false);
    runAction(async () => {
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
      ref={buttonRef}
      type="button"
      aria-label={`Renomear quadro ${boardName}`}
      className="cursor-text truncate rounded-md px-1 font-medium text-foreground outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
      onClick={startEditing}
    >
      {boardName}
    </button>
  );
}
