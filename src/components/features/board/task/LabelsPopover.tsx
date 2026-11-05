'use client';

import { useState, useTransition } from 'react';
import { PencilIcon, TagIcon } from 'lucide-react';
import { toggleTaskLabel } from '@/app/(app)/dashboard/taskActions';
import { LabelChip } from '@/components/features/board/LabelChip';
import { LabelForm } from '@/components/features/board/task/LabelForm';
import { Button, buttonVariants } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover';
import type { BoardLabel, BoardTask } from '@/types/board';

interface LabelsPopoverProps {
  task: BoardTask;
  labels: BoardLabel[];
}

export function LabelsPopover({ task, labels }: LabelsPopoverProps) {
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<BoardLabel | 'new' | null>(null);
  const [, startTransition] = useTransition();
  const matches = labels.filter((label) =>
    label.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <Popover onOpenChange={() => setEditing(null)}>
      <PopoverTrigger
        className={buttonVariants({ variant: 'outline', size: 'sm' })}
      >
        <TagIcon /> Etiquetas
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72">
        {editing ? (
          <LabelForm
            label={editing === 'new' ? null : editing}
            onDone={() => setEditing(null)}
          />
        ) : (
          <div className="flex flex-col gap-2">
            <Input
              value={query}
              placeholder="Buscar etiquetas"
              onChange={(event) => setQuery(event.target.value)}
            />
            <ul className="flex max-h-64 flex-col gap-1 overflow-y-auto">
              {matches.map((label) => (
                <li key={label.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    aria-label={label.name || label.color}
                    checked={task.labelIds.includes(label.id)}
                    onChange={() =>
                      startTransition(() => toggleTaskLabel(task.id, label.id))
                    }
                  />
                  <span className="min-w-0 flex-1">
                    <LabelChip label={label} />
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Editar etiqueta"
                    onClick={() => setEditing(label)}
                  >
                    <PencilIcon />
                  </Button>
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing('new')}
            >
              Criar uma nova etiqueta
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
