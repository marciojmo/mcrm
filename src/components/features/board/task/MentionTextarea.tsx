'use client';

import { useId, useState } from 'react';
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const listId = useId();
  const query = MENTION_QUERY.exec(value.slice(0, caret))?.[1];
  const suggestions =
    query === undefined || isDismissed
      ? []
      : users
          .filter((user) =>
            user.name.toLowerCase().includes(query.trim().toLowerCase())
          )
          .slice(0, 5);

  const isOpen = suggestions.length > 0;
  const active = Math.min(activeIndex, suggestions.length - 1);
  const optionId = (userId: string) => `${listId}-${userId}`;

  function change(text: string, position: number) {
    setCaret(position);
    setActiveIndex(0);
    setIsDismissed(false);
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
    setActiveIndex(0);
    setCaret(start + user.name.length + 2);
    onChange(text, ids);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!isOpen || event.nativeEvent.isComposing) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex((active + step + suggestions.length) % suggestions.length);
    } else if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      mention(suggestions[active]);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      setIsDismissed(true);
    }
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
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-activedescendant={
          isOpen ? optionId(suggestions[active].id) : undefined
        }
        rows={3}
        value={value}
        placeholder="Escrever um comentário... use @ para mencionar"
        onChange={(event) =>
          change(event.target.value, event.target.selectionStart)
        }
        onKeyDown={handleKeyDown}
        onSelect={(event) => setCaret(event.currentTarget.selectionStart)}
      />
      {isOpen && (
        <ul
          id={listId}
          role="listbox"
          className="rounded-lg border bg-popover p-1 shadow-md"
        >
          {suggestions.map((user, index) => (
            <li
              key={user.id}
              id={optionId(user.id)}
              role="option"
              aria-selected={index === active}
              className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted ${index === active ? 'bg-muted' : ''}`}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => mention(user)}
            >
              <UserAvatar user={user} isDecorative />
              {user.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
