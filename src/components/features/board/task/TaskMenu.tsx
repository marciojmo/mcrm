'use client';

import { useState } from 'react';
import {
  ArchiveIcon,
  CopyIcon,
  EyeIcon,
  MoreHorizontalIcon,
} from 'lucide-react';
import {
  duplicateTask,
  toggleTaskFollower,
} from '@/app/(app)/dashboard/actions';
import { ArchiveTaskDialog } from '@/components/features/board/task/ArchiveTaskDialog';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { useToast } from '@/components/ui/Toast';
import { useSafeTransition } from '@/hooks/useSafeTransition';

interface TaskMenuProps {
  taskId: string;
  isFollowing: boolean;
  onClose: () => void;
}

export function TaskMenu({ taskId, isFollowing, onClose }: TaskMenuProps) {
  const [isArchiving, setIsArchiving] = useState(false);
  const { runAction } = useSafeTransition();
  const toast = useToast();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Ações da tarefa"
              className="absolute top-2 right-11"
            />
          }
        >
          <MoreHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            onClick={() =>
              runAction(async () => {
                await toggleTaskFollower(taskId);
                toast.add({
                  title: isFollowing ? 'Deixou de seguir' : 'Seguindo Tarefa',
                });
              })
            }
          >
            <EyeIcon />
            {isFollowing ? 'Deixar de seguir' : 'Seguir'}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              runAction(async () => {
                await duplicateTask(taskId);
                toast.add({ title: 'Tarefa duplicada!' });
                onClose();
              })
            }
          >
            <CopyIcon />
            Duplicar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsArchiving(true)}>
            <ArchiveIcon />
            Arquivar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ArchiveTaskDialog
        taskId={taskId}
        isOpen={isArchiving}
        onOpenChange={setIsArchiving}
        onArchived={onClose}
      />
    </>
  );
}
