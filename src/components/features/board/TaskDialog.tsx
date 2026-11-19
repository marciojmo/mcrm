'use client';

import { EyeIcon } from 'lucide-react';
import { toggleTaskLabel } from '@/app/(app)/dashboard/taskActions';
import { LabelChip } from '@/components/features/board/LabelChip';
import { AddAttachmentPopover } from '@/components/features/board/task/AddAttachmentPopover';
import { AddChecklistPopover } from '@/components/features/board/task/AddChecklistPopover';
import { AttachmentsSection } from '@/components/features/board/task/AttachmentsSection';
import { ChecklistBlock } from '@/components/features/board/task/ChecklistBlock';
import { CommentsSection } from '@/components/features/board/task/CommentsSection';
import { DueDateField } from '@/components/features/board/task/DueDateField';
import { LabelsPopover } from '@/components/features/board/task/LabelsPopover';
import { MembersPopover } from '@/components/features/board/task/MembersPopover';
import { TaskMenu } from '@/components/features/board/task/TaskMenu';
import { TaskCheckbox } from '@/components/features/board/TaskCheckbox';
import { UserAvatar } from '@/components/features/board/UserAvatar';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { MAX_DESCRIPTION_LENGTH } from '@/constants/task';
import { useTaskCompletion } from '@/hooks/useTaskCompletion';
import { useTaskDraft } from '@/hooks/useTaskDraft';
import { useTaskExtras } from '@/hooks/useTaskExtras';
import type { BoardLabel, BoardTask, BoardUser } from '@/types/board';
import type { TaskReference } from '@/types/task';

interface TaskDialogProps {
  boardId: string;
  task: BoardTask;
  users: BoardUser[];
  labels: BoardLabel[];
  currentUserId: string;
  highlightCommentId: string | null;
  onClose: () => void;
  onOpenTask: (reference: TaskReference) => void;
}

export function TaskDialog({
  boardId,
  task,
  users,
  labels,
  currentUserId,
  highlightCommentId,
  onClose,
  onOpenTask,
}: TaskDialogProps) {
  const { details, setDetails, isPending, runAction, saveField, close } =
    useTaskDraft(task, onClose);
  const { extras, reload } = useTaskExtras(task.id);
  const completion = useTaskCompletion(task.id, task.isCompleted);
  const taskLabels = labels.filter((label) => task.labelIds.includes(label.id));
  const isFollowing = task.followerIds.includes(currentUserId);
  const members = users.filter((user) => task.memberIds.includes(user.id));

  return (
    <Dialog open onOpenChange={(isOpen) => !isOpen && close()}>
      <DialogContent className="flex h-[80vh] w-[80vw] max-w-none gap-0 p-0 sm:max-w-none">
        <DialogTitle className="sr-only">Detalhes da tarefa</DialogTitle>
        <div className="flex min-h-0 w-[65%] flex-col gap-4 p-4">
          <span className="-mb-3 flex gap-2 font-mono text-xs text-muted-foreground">
            {task.identifier}
            <span aria-live="polite">{isPending ? 'Salvando…' : ''}</span>
          </span>
          <div className="flex items-center gap-2">
            <TaskCheckbox
              isCompleted={completion.isCompleted}
              isAlwaysVisible
              onToggle={completion.toggle}
            />
            <Input
              value={details.title}
              maxLength={200}
              aria-label="Título"
              className="h-auto flex-1 border-transparent bg-transparent py-1 pr-10 text-xl font-semibold shadow-none hover:bg-muted focus-visible:bg-transparent"
              onChange={(event) =>
                setDetails({ ...details, title: event.target.value })
              }
              onBlur={() => saveField()}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <LabelsPopover boardId={boardId} task={task} labels={labels} />
            <MembersPopover task={task} users={users} />
            <AddChecklistPopover
              taskId={task.id}
              checklistCount={extras?.checklists.length ?? 0}
              onChange={reload}
            />
            <AddAttachmentPopover taskId={task.id} onChange={reload} />
            <DueDateField
              value={details.dueDate}
              onChange={(dueDate) => saveField({ dueDate })}
            />
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
                    <LabelChip
                      key={label.id}
                      label={label}
                      onRemove={() =>
                        runAction(() => toggleTaskLabel(task.id, label.id))
                      }
                    />
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
                maxLength={MAX_DESCRIPTION_LENGTH}
                value={details.description ?? ''}
                placeholder="Adicione uma descrição"
                className="font-normal"
                onChange={(event) =>
                  setDetails({ ...details, description: event.target.value })
                }
                onBlur={() => saveField()}
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
            highlightCommentId={highlightCommentId}
            comments={extras?.comments ?? []}
            taskReferences={extras?.taskReferences ?? []}
            onChange={reload}
            onOpenTask={onOpenTask}
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
