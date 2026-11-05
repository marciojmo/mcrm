'use client';

import { useState, useTransition } from 'react';
import { addComment } from '@/app/(app)/dashboard/taskActions';
import { CommentItem } from '@/components/features/board/task/CommentItem';
import { MentionTextarea } from '@/components/features/board/task/MentionTextarea';
import { Button } from '@/components/ui/Button';
import type { BoardUser } from '@/types/board';
import type { TaskComment } from '@/types/task';

interface CommentsSectionProps {
  taskId: string;
  users: BoardUser[];
  currentUserId: string;
  comments: TaskComment[];
  onChange: () => Promise<void>;
}

export function CommentsSection({
  taskId,
  users,
  currentUserId,
  comments,
  onChange,
}: CommentsSectionProps) {
  const [body, setBody] = useState('');
  const [mentionedIds, setMentionedIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  function submit() {
    if (!body.trim()) return;
    startTransition(async () => {
      await addComment(taskId, body, mentionedIds);
      await onChange();
      setBody('');
      setMentionedIds([]);
    });
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-3">
      <h3 className="pr-8 text-sm font-semibold">Comentários</h3>
      <MentionTextarea
        key={comments.length}
        value={body}
        users={users}
        onChange={(text, ids) => {
          setBody(text);
          setMentionedIds(ids);
        }}
      />
      <Button
        size="sm"
        className="self-start"
        disabled={isPending || !body.trim()}
        onClick={submit}
      >
        Comentar
      </Button>
      <ul className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            users={users}
            currentUserId={currentUserId}
            onChange={onChange}
          />
        ))}
      </ul>
    </section>
  );
}
