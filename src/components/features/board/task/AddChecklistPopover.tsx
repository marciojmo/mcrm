'use client';

import { useState, useTransition } from 'react';
import { SquareCheckIcon } from 'lucide-react';
import { addChecklist } from '@/app/(app)/dashboard/taskActions';
import { Button, buttonVariants } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover';

interface AddChecklistPopoverProps {
  taskId: string;
  onChange: () => Promise<void>;
}

export function AddChecklistPopover({
  taskId,
  onChange,
}: AddChecklistPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('Checklist');
  const [isPending, startTransition] = useTransition();

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    startTransition(async () => {
      await addChecklist(taskId, title);
      await onChange();
      setIsOpen(false);
      setTitle('Checklist');
    });
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        className={buttonVariants({ variant: 'outline', size: 'sm' })}
      >
        <SquareCheckIcon /> Checklist
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72">
        <form onSubmit={submit} className="flex flex-col gap-2">
          <label className="flex flex-col gap-1 text-xs font-medium">
            Título
            <Input
              autoFocus
              value={title}
              maxLength={200}
              onFocus={(event) => event.target.select()}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>
          <Button type="submit" size="sm" disabled={isPending}>
            Adicionar
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
