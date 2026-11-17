import Link from 'next/link';
import { splitByTaskIdentifiers } from '@/lib/taskIdentifier';
import type { BoardUser } from '@/types/board';
import type { TaskComment, TaskReference } from '@/types/task';

interface CommentBodyProps {
  comment: TaskComment;
  users: BoardUser[];
  taskReferences: TaskReference[];
  onOpenTask: (reference: TaskReference) => void;
}

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function CommentBody({
  comment,
  users,
  taskReferences,
  onOpenTask,
}: CommentBodyProps) {
  const names = comment.mentionedUserIds
    .map((id) => users.find((user) => user.id === id)?.name)
    .filter((name): name is string => Boolean(name))
    .map((name) => `@${name}`);
  const mentionParts =
    names.length === 0
      ? [comment.body]
      : comment.body.split(
          new RegExp(`(${names.map(escapeRegExp).join('|')})`)
        );

  function renderText(text: string, key: number) {
    return splitByTaskIdentifiers(text).map((part, index) => {
      const reference = taskReferences.find((item) => item.identifier === part);
      if (!reference) return part;
      return (
        <Link
          key={`${key}-${index}`}
          href={`/dashboard/${reference.boardId}?task=${reference.taskId}`}
          className="rounded bg-muted px-1 font-mono text-xs text-muted-foreground ring-1 ring-foreground/10 hover:text-foreground"
          onClick={(event) => {
            event.preventDefault();
            onOpenTask(reference);
          }}
        >
          {part}
        </Link>
      );
    });
  }

  return (
    <p className="whitespace-pre-wrap break-words">
      {mentionParts.map((part, index) =>
        names.includes(part) ? (
          <span
            key={index}
            className="rounded bg-primary/10 px-1 font-medium text-primary"
          >
            {part}
          </span>
        ) : (
          renderText(part, index)
        )
      )}
    </p>
  );
}
