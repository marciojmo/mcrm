'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import {
  deleteComment,
  updateComment,
} from '@/app/(app)/dashboard/taskActions';
import { MentionTextarea } from '@/components/features/board/task/MentionTextarea';
import { UserAvatar } from '@/components/features/board/UserAvatar';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { BoardUser } from '@/types/board';
import type { TaskComment } from '@/types/task';

interface CommentItemProps {
  comment: TaskComment;
  users: BoardUser[];
  currentUserId: string;
  isHighlighted: boolean;
  onChange: () => Promise<void>;
}

function renderBody(comment: TaskComment, users: BoardUser[]) {
  const names = comment.mentionedUserIds
    .map((id) => users.find((user) => user.id === id)?.name)
    .filter((name): name is string => Boolean(name))
    .map((name) => `@${name}`);
  if (names.length === 0) return comment.body;
  const pattern = new RegExp(
    `(${names.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`
  );
  return comment.body.split(pattern).map((part, index) =>
    names.includes(part) ? (
      <span
        key={index}
        className="rounded bg-primary/10 px-1 font-medium text-primary"
      >
        {part}
      </span>
    ) : (
      part
    )
  );
}

export function CommentItem({
  comment,
  users,
  currentUserId,
  isHighlighted,
  onChange,
}: CommentItemProps) {
  const itemRef = useRef<HTMLLIElement>(null);
  useEffect(() => {
    if (isHighlighted) itemRef.current?.scrollIntoView({ block: 'center' });
  }, [isHighlighted]);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [body, setBody] = useState(comment.body);
  const [mentionedIds, setMentionedIds] = useState(comment.mentionedUserIds);
  const [isPending, startTransition] = useTransition();
  const isOwn = comment.author.id === currentUserId;

  function run(action: () => Promise<void>, onDone: () => void) {
    startTransition(async () => {
      await action();
      await onChange();
      onDone();
    });
  }

  return (
    <li
      ref={itemRef}
      className={cn(
        'flex gap-2 rounded-lg text-sm',
        isHighlighted && 'animate-comment-highlight'
      )}
    >
      <UserAvatar user={comment.author} />
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
          <p className="whitespace-pre-wrap break-words">
            {renderBody(comment, users)}
          </p>
        )}
        {isOwn && !isEditing && (
          <div className="flex gap-2 text-xs">
            <Button
              size="xs"
              variant="ghost"
              onClick={() => setIsEditing(true)}
            >
              Editar
            </Button>
            {isConfirmingDelete ? (
              <Button
                size="xs"
                variant="destructive"
                disabled={isPending}
                onClick={() =>
                  run(
                    () => deleteComment(comment.id),
                    () => setIsConfirmingDelete(false)
                  )
                }
              >
                Confirmar exclusão
              </Button>
            ) : (
              <Button
                size="xs"
                variant="ghost"
                onClick={() => setIsConfirmingDelete(true)}
              >
                Excluir
              </Button>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
