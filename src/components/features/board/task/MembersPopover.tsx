'use client';

import { useState, useTransition } from 'react';
import { CheckIcon, UserPlusIcon } from 'lucide-react';
import { toggleTaskMember } from '@/app/(app)/dashboard/taskActions';
import { UserAvatar } from '@/components/features/board/UserAvatar';
import { buttonVariants } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover';
import type { BoardTask, BoardUser } from '@/types/board';

interface MembersPopoverProps {
  task: BoardTask;
  users: BoardUser[];
}

export function MembersPopover({ task, users }: MembersPopoverProps) {
  const [query, setQuery] = useState('');
  const [, startTransition] = useTransition();
  const matches = users.filter((user) =>
    user.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <Popover>
      <PopoverTrigger
        className={buttonVariants({ variant: 'outline', size: 'sm' })}
      >
        <UserPlusIcon /> Membros
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72">
        <div className="flex flex-col gap-2">
          <Input
            value={query}
            placeholder="Pesquisar membros"
            onChange={(event) => setQuery(event.target.value)}
          />
          <ul className="flex max-h-64 flex-col overflow-y-auto">
            {matches.length === 0 && (
              <li className="px-2 py-1.5 text-sm text-muted-foreground">
                Nenhum usuário encontrado
              </li>
            )}
            {matches.map((user) => (
              <li key={user.id}>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
                  onClick={() =>
                    startTransition(() => toggleTaskMember(task.id, user.id))
                  }
                >
                  <UserAvatar user={user} />
                  <span className="flex-1 truncate">{user.name}</span>
                  {task.memberIds.includes(user.id) && (
                    <CheckIcon className="size-4" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  );
}
