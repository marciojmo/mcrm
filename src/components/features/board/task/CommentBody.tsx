import Link from 'next/link';
import { ExternalLink } from '@/components/ui/ExternalLink';
import { linkify } from '@/lib/linkify';
import {
  MENTION_HIGHLIGHT_CLASS,
  getMentionNames,
  splitByMentions,
} from '@/lib/mentions';
import { splitByTaskIdentifiers } from '@/lib/taskIdentifier';
import type { BoardUser } from '@/types/board';
import type { TaskComment, TaskReference } from '@/types/task';

interface CommentBodyProps {
  comment: TaskComment;
  users: BoardUser[];
  taskReferences: TaskReference[];
  onOpenTask: (reference: TaskReference) => void;
}

export function CommentBody({
  comment,
  users,
  taskReferences,
  onOpenTask,
}: CommentBodyProps) {
  const names = getMentionNames(comment.mentionedUserIds, users);
  const mentionParts = splitByMentions(comment.body, names);

  function renderText(text: string, key: number) {
    return linkify(text).map((segment, segmentIndex) =>
      segment.isLink ? (
        <ExternalLink key={`${key}-${segmentIndex}`} href={segment.text} />
      ) : (
        renderTaskReferences(segment.text, `${key}-${segmentIndex}`)
      )
    );
  }

  function renderTaskReferences(text: string, key: string) {
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
            className={`${MENTION_HIGHLIGHT_CLASS} px-1 font-medium`}
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
