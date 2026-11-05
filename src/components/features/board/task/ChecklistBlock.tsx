'use client';

import { useTransition } from 'react';
import { Trash2Icon, XIcon } from 'lucide-react';
import {
  addChecklistItem,
  deleteChecklist,
  deleteChecklistItem,
  setChecklistItemDone,
} from '@/app/(app)/dashboard/taskActions';
import { AddTextForm } from '@/components/ui/AddTextForm';
import { Button } from '@/components/ui/Button';
import type { Checklist } from '@/types/task';

interface ChecklistBlockProps {
  checklist: Checklist;
  onChange: () => Promise<void>;
}

export function ChecklistBlock({ checklist, onChange }: ChecklistBlockProps) {
  const [, startTransition] = useTransition();
  const doneCount = checklist.items.filter((item) => item.isDone).length;
  const percent = checklist.items.length
    ? Math.round((doneCount / checklist.items.length) * 100)
    : 0;

  function run(action: () => Promise<void>) {
    startTransition(async () => {
      await action();
      await onChange();
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{checklist.title}</h3>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => run(() => deleteChecklist(checklist.id))}
        >
          <Trash2Icon /> Excluir
        </Button>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {percent}%
        <div className="h-1.5 flex-1 rounded bg-muted">
          <div
            className="h-full rounded bg-primary"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      <ul className="flex flex-col gap-1">
        {checklist.items.map((item) => (
          <li key={item.id} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={item.isDone}
              aria-label={item.text}
              onChange={(event) =>
                run(() => setChecklistItemDone(item.id, event.target.checked))
              }
            />
            <span
              className={`flex-1 break-words ${item.isDone ? 'text-muted-foreground line-through' : ''}`}
            >
              {item.text}
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Remover item"
              onClick={() => run(() => deleteChecklistItem(item.id))}
            >
              <XIcon />
            </Button>
          </li>
        ))}
      </ul>
      <AddTextForm
        addLabel="Adicionar um item"
        placeholder="Texto do item"
        onSubmit={async (text) => {
          await addChecklistItem(checklist.id, text);
          await onChange();
        }}
      />
    </div>
  );
}
