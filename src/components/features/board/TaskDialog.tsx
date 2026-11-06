'use client';

import { useState, useTransition } from 'react';
import { EyeIcon } from 'lucide-react';
import { updateTask } from '@/app/(app)/dashboard/actions';
import { LabelChip } from '@/components/features/board/LabelChip';
import { AddAttachmentPopover } from '@/components/features/board/task/AddAttachmentPopover';
import { AddChecklistPopover } from '@/components/features/board/task/AddChecklistPopover';
import { AttachmentsSection } from '@/components/features/board/task/AttachmentsSection';
import { ChecklistBlock } from '@/components/features/board/task/ChecklistBlock';
import { CommentsSection } from '@/components/features/board/task/CommentsSection';
import { LabelsPopover } from '@/components/features/board/task/LabelsPopover';
import { MembersPopover } from '@/components/features/board/task/MembersPopover';
import { TaskMenu } from '@/components/features/board/task/TaskMenu';
import { UserAvatar } from '@/components/features/board/UserAvatar';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useTaskExtras } from '@/hooks/useTaskExtras';
import type {
  BoardLabel,
  BoardTask,
  BoardUser,
  TaskDetails,
} from '@/types/board';

interface TaskDialogProps {
  task: BoardTask;
  users: BoardUser[];
  labels: BoardLabel[];
  currentUserId: string;
  onClose: () => void;
}

export function TaskDialog({
  task,
  users,
  labels,
  currentUserId,
  onClose,
}: TaskDialogProps) {
  const [details, setDetails] = useState<TaskDetails>({
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
  });
  const [, startTransition] = useTransition();
  const { extras, reload } = useTaskExtras(task.id);
  const taskLabels = labels.filter((label) => task.labelIds.includes(label.id));
  const isFollowing = task.followerIds.includes(currentUserId);
  const members = users.filter((user) => task.memberIds.includes(user.id));

  function save(changes: Partial<TaskDetails>) {
    const next = { ...details, ...changes };
    if (!next.title.trim()) {
      setDetails({ ...next, title: task.title });
      return;
    }
    setDetails(next);
    startTransition(() => updateTask(task.id, next));
  }

  return (
    <Dialog open onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="flex h-[80vh] w-[80vw] max-w-none gap-0 p-0 sm:max-w-none">
        <DialogTitle className="sr-only">Detalhes da tarefa</DialogTitle>
        <div className="flex min-h-0 w-[65%] flex-col gap-4 p-4">
          <Input
            value={details.title}
            maxLength={200}
            aria-label="Título"
            className="h-auto border-transparent bg-transparent py-1 pr-10 text-xl font-semibold shadow-none hover:bg-muted focus-visible:bg-transparent"
            onChange={(event) =>
              setDetails({ ...details, title: event.target.value })
            }
            onBlur={() => save({})}
          />
          <div className="flex flex-wrap items-center gap-2">
            <LabelsPopover task={task} labels={labels} />
            <MembersPopover task={task} users={users} />
            <AddChecklistPopover taskId={task.id} onChange={reload} />
            <AddAttachmentPopover taskId={task.id} onChange={reload} />
            <label className="flex items-center gap-2 text-sm font-medium">
              Prazo
              <Input
                type="date"
                className="w-40"
                value={details.dueDate ?? ''}
                onChange={(event) =>
                  save({ dueDate: event.target.value || null })
                }
              />
            </label>
            {isFollowing && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <EyeIcon className="size-4" />
                Seguindo
              </span>
            )}
          </div>
          {(members.length > 0 || taskLabels.length > 0) && (
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {members.length > 0 && (
                <div className="flex items-center gap-1" aria-label="Membros">
                  {members.map((user) => (
                    <UserAvatar key={user.id} user={user} />
                  ))}
                </div>
              )}
              {taskLabels.length > 0 && (
                <div className="flex flex-wrap gap-1" aria-label="Etiquetas">
                  {taskLabels.map((label) => (
                    <LabelChip key={label.id} label={label} />
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto pr-1">
            <label className="flex flex-col gap-1.5 text-sm font-semibold">
              Descrição
              <Textarea
                rows={5}
                value={details.description ?? ''}
                placeholder="Adicione uma descrição"
                className="font-normal"
                onChange={(event) =>
                  setDetails({ ...details, description: event.target.value })
                }
                onBlur={() => save({})}
              />
            </label>
            {extras?.checklists.map((checklist) => (
              <ChecklistBlock
                key={checklist.id}
                checklist={checklist}
                onChange={reload}
              />
            ))}
            <AttachmentsSection
              attachments={extras?.attachments ?? []}
              onChange={reload}
            />
          </div>
        </div>
        <aside className="flex min-h-0 w-[35%] flex-col border-l bg-muted/30 p-4">
          <CommentsSection
            taskId={task.id}
            users={users}
            currentUserId={currentUserId}
            comments={extras?.comments ?? []}
            onChange={reload}
          />
        </aside>
        <TaskMenu
          taskId={task.id}
          isFollowing={isFollowing}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
