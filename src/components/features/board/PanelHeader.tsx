'use client';

import { useState, useTransition, type HTMLAttributes } from 'react';
import { MoreHorizontalIcon } from 'lucide-react';
import { renamePanel } from '@/app/(app)/dashboard/actions';
import { ArchivePanelDialog } from '@/components/features/board/ArchivePanelDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { Input } from '@/components/ui/Input';
import type { BoardPanel } from '@/types/board';

interface PanelHeaderProps {
  panel: BoardPanel;
  dragProps: HTMLAttributes<HTMLDivElement>;
}

export function PanelHeader({ panel, dragProps }: PanelHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [name, setName] = useState(panel.name);
  const [isPending, startTransition] = useTransition();

  function startEditing() {
    setName(panel.name);
    setIsEditing(true);
  }

  function save() {
    if (isPending) return;
    const trimmed = name.trim();
    if (!trimmed || trimmed === panel.name) return setIsEditing(false);
    startTransition(async () => {
      await renamePanel(panel.id, trimmed);
      setIsEditing(false);
    });
  }

  return (
    <>
      <div
        className="flex cursor-grab touch-none items-center justify-between gap-1 px-2 pt-1"
        {...(isEditing ? {} : dragProps)}
      >
        {isEditing ? (
          <Input
            autoFocus
            value={name}
            maxLength={200}
            aria-label="Nome do painel"
            onChange={(event) => setName(event.target.value)}
            onFocus={(event) => event.target.select()}
            onBlur={save}
            onKeyDown={(event) => {
              if (event.key === 'Enter') save();
              if (event.key === 'Escape') setIsEditing(false);
            }}
          />
        ) : (
          <h2
            className="min-w-0 flex-1 cursor-text truncate text-sm font-semibold"
            onClick={startEditing}
          >
            {panel.name}
          </h2>
        )}
        <span className="text-xs text-muted-foreground">
          {panel.tasks.length}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Menu do painel"
            className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-background focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <MoreHorizontalIcon className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => setIsArchiving(true)}>
              Arquivar painel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ArchivePanelDialog
        panel={panel}
        isOpen={isArchiving}
        onOpenChange={setIsArchiving}
      />
    </>
  );
}
