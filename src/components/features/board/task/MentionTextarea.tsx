'use client';

import { useState } from 'react';
import { UserAvatar } from '@/components/features/board/UserAvatar';
import { Textarea } from '@/components/ui/Textarea';
import type { BoardUser } from '@/types/board';

interface MentionTextareaProps {
  value: string;
  users: BoardUser[];
  initialMentionedIds?: string[];
  autoFocus?: boolean;
  onChange: (value: string, mentionedUserIds: string[]) => void;
}

const MENTION_QUERY = /@([^@\n]*)$/;

export function MentionTextarea({
  value,
  users,
  initialMentionedIds = [],
  autoFocus = false,
  onChange,
}: MentionTextareaProps) {
  const [mentionedIds, setMentionedIds] =
    useState<string[]>(initialMentionedIds);
  const [caret, setCaret] = useState(0);
  const query = MENTION_QUERY.exec(value.slice(0, caret))?.[1];
  const suggestions =
    query === undefined
      ? []
      : users
          .filter((user) =>
            user.name.toLowerCase().includes(query.trim().toLowerCase())
          )
          .slice(0, 5);

  function change(text: string, position: number) {
    setCaret(position);
    const stillMentioned = mentionedIds.filter((id) => {
      const user = users.find((item) => item.id === id);
      return user && text.includes(`@${user.name}`);
    });
    setMentionedIds(stillMentioned);
    onChange(text, stillMentioned);
  }

  function mention(user: BoardUser) {
    const start = caret - (query?.length ?? 0) - 1;
    const text = `${value.slice(0, start)}@${user.name} ${value.slice(caret)}`;
    const ids = [...new Set([...mentionedIds, user.id])];
    setMentionedIds(ids);
    setCaret(start + user.name.length + 2);
    onChange(text, ids);
  }

  return (
    <div className="flex flex-col gap-1">
      <Textarea
        autoFocus={autoFocus}
        onFocus={(event) => {
          if (!autoFocus) return;
          const end = event.currentTarget.value.length;
          event.currentTarget.setSelectionRange(end, end);
        }}
        rows={3}
        value={value}
        placeholder="Escrever um comentário... use @ para mencionar"
        onChange={(event) =>
          change(event.target.value, event.target.selectionStart)
        }
        onSelect={(event) => setCaret(event.currentTarget.selectionStart)}
      />
      {suggestions.length > 0 && (
        <ul className="rounded-lg border bg-popover p-1 shadow-md">
          {suggestions.map((user) => (
            <li key={user.id}>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => mention(user)}
              >
                <UserAvatar user={user} />
                {user.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
