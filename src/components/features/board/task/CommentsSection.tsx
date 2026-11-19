'use client';

import { useRef, useState } from 'react';
import { addComment } from '@/app/(app)/dashboard/taskActions';
import { CommentItem } from '@/components/features/board/task/CommentItem';
import { MentionTextarea } from '@/components/features/board/task/MentionTextarea';
import { Button } from '@/components/ui/Button';
import type { BoardUser } from '@/types/board';
import type { TaskComment, TaskReference } from '@/types/task';
import { useFocusAfterRemoval } from '@/hooks/useFocusAfterRemoval';
import { useSafeTransition } from '@/hooks/useSafeTransition';

interface CommentsSectionProps {
  taskId: string;
  users: BoardUser[];
  currentUserId: string;
  highlightCommentId: string | null;
  comments: TaskComment[];
  taskReferences: TaskReference[];
  onChange: () => Promise<void>;
  onOpenTask: (reference: TaskReference) => void;
}

export function CommentsSection({
  taskId,
  users,
  currentUserId,
  highlightCommentId,
  comments,
  taskReferences,
  onChange,
  onOpenTask,
}: CommentsSectionProps) {
  const [body, setBody] = useState('');
  const [mentionedIds, setMentionedIds] = useState<string[]>([]);
  const { isPending, runAction } = useSafeTransition();
  const sectionRef = useRef<HTMLElement>(null);
  useFocusAfterRemoval(comments.length, () =>
    sectionRef.current?.querySelector('textarea')
  );

  function submit() {
    if (!body.trim()) return;
    runAction(async () => {
      await addComment(taskId, body, mentionedIds);
      setBody('');
      setMentionedIds([]);
      await onChange();
    });
  }

  return (
    <section ref={sectionRef} className="flex min-h-0 flex-1 flex-col gap-3">
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
            isHighlighted={comment.id === highlightCommentId}
            taskReferences={taskReferences}
            onChange={onChange}
            onOpenTask={onOpenTask}
          />
        ))}
      </ul>
    </section>
  );
}
