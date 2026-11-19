'use client';

import { useEffect, useRef, useState } from 'react';
import {
  deleteComment,
  updateComment,
} from '@/app/(app)/dashboard/taskActions';
import { CommentBody } from '@/components/features/board/task/CommentBody';
import { MentionTextarea } from '@/components/features/board/task/MentionTextarea';
import { UserAvatar } from '@/components/features/board/UserAvatar';
import { Button } from '@/components/ui/Button';
import { ConfirmDeleteButton } from '@/components/ui/ConfirmDeleteButton';
import { cn } from '@/lib/utils';
import type { BoardUser } from '@/types/board';
import type { TaskComment, TaskReference } from '@/types/task';
import { DELETE_ERROR_MESSAGE } from '@/constants/errorMessages';
import { useSafeTransition } from '@/hooks/useSafeTransition';

interface CommentItemProps {
  comment: TaskComment;
  users: BoardUser[];
  currentUserId: string;
  isHighlighted: boolean;
  taskReferences: TaskReference[];
  onChange: () => Promise<void>;
  onOpenTask: (reference: TaskReference) => void;
}

export function CommentItem({
  comment,
  users,
  currentUserId,
  isHighlighted,
  taskReferences,
  onChange,
  onOpenTask,
}: CommentItemProps) {
  const itemRef = useRef<HTMLLIElement>(null);
  useEffect(() => {
    if (isHighlighted) itemRef.current?.scrollIntoView({ block: 'center' });
  }, [isHighlighted]);
  const [isEditing, setIsEditing] = useState(false);
  const [body, setBody] = useState(comment.body);
  const [mentionedIds, setMentionedIds] = useState(comment.mentionedUserIds);
  const { isPending, runAction } = useSafeTransition();
  const isOwn = comment.author.id === currentUserId;

  function run(
    action: () => Promise<void>,
    onDone?: () => void,
    errorMessage?: string
  ) {
    runAction(
      async () => {
        await action();
        await onChange();
        onDone?.();
      },
      { errorMessage }
    );
  }

  return (
    <li
      ref={itemRef}
      className={cn(
        'flex gap-2 rounded-lg text-sm',
        isHighlighted && 'animate-comment-highlight'
      )}
    >
      <UserAvatar user={comment.author} isDecorative />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="font-medium">
          {comment.author.name}{' '}
          <span className="text-xs font-normal text-muted-foreground">
            {new Date(comment.createdAt).toLocaleString('pt-BR')}
          </span>
        </p>
        {isEditing ? (
          <>
            <MentionTextarea
              value={body}
              users={users}
              initialMentionedIds={comment.mentionedUserIds}
              autoFocus
              onChange={(text, ids) => {
                setBody(text);
                setMentionedIds(ids);
              }}
            />
            <div className="flex gap-2">
              <Button
                size="xs"
                disabled={isPending || !body.trim()}
                onClick={() =>
                  run(
                    () => updateComment(comment.id, body, mentionedIds),
                    () => setIsEditing(false)
                  )
                }
              >
                Salvar
              </Button>
              <Button
                size="xs"
                variant="ghost"
                onClick={() => {
                  setBody(comment.body);
                  setIsEditing(false);
                }}
              >
                Cancelar
              </Button>
            </div>
          </>
        ) : (
          <CommentBody
            comment={comment}
            users={users}
            taskReferences={taskReferences}
            onOpenTask={onOpenTask}
          />
        )}
        {isOwn && !isEditing && (
          <div className="flex flex-wrap gap-2 text-xs">
            <Button
              size="xs"
              variant="ghost"
              onClick={() => setIsEditing(true)}
            >
              Editar
            </Button>
            <ConfirmDeleteButton
              isPending={isPending}
              onConfirm={() =>
                run(
                  () => deleteComment(comment.id),
                  undefined,
                  DELETE_ERROR_MESSAGE
                )
              }
            >
              Excluir
            </ConfirmDeleteButton>
          </div>
        )}
      </div>
    </li>
  );
}
