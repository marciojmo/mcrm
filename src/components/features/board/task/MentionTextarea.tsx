'use client';

import { useId, useLayoutEffect, useRef, useState } from 'react';
import { UserAvatar } from '@/components/features/board/UserAvatar';
import { Textarea } from '@/components/ui/Textarea';
import {
  MENTION_HIGHLIGHT_CLASS,
  getMentionNames,
  isCompletedMention,
  splitByMentions,
} from '@/lib/mentions';
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
  const [dismissedAt, setDismissedAt] = useState<number | null>(null);
  const listId = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);
  const pendingCaret = useRef<number | null>(null);
  const names = getMentionNames(mentionedIds, users);
  const query = MENTION_QUERY.exec(value.slice(0, caret))?.[1];
  const queryStart = caret - (query?.length ?? 0) - 1;
  const suggestions =
    query === undefined ||
    isCompletedMention(query, names, users) ||
    dismissedAt === queryStart
      ? []
      : users
          .filter(
            (user) =>
              !user.isBanned &&
              user.name.toLowerCase().includes(query.trim().toLowerCase())
          )
          .slice(0, 5);

  const isOpen = suggestions.length > 0;
  const active = Math.min(activeIndex, suggestions.length - 1);
  const optionId = (userId: string) => `${listId}-${userId}`;

  useLayoutEffect(() => {
    if (pendingCaret.current === null) return;
    textareaRef.current?.setSelectionRange(
      pendingCaret.current,
      pendingCaret.current
    );
    pendingCaret.current = null;
  }, [value]);

  function change(text: string, position: number) {
    setCaret(position);
    setActiveIndex(0);
    setDismissedAt(null);
    const stillMentioned = mentionedIds.filter((id) => {
      const user = users.find((item) => item.id === id);
      return user && text.includes(`@${user.name}`);
    });
    setMentionedIds(stillMentioned);
    onChange(text, stillMentioned);
  }

  function mention(user: BoardUser) {
    const rest = value.slice(caret);
    const suffix = /^\s/.test(rest) ? '' : ' ';
    const text = `${value.slice(0, queryStart)}@${user.name}${suffix}${rest}`;
    const ids = [...new Set([...mentionedIds, user.id])];
    setMentionedIds(ids);
    setActiveIndex(0);
    const position = queryStart + user.name.length + 2;
    pendingCaret.current = position;
    setCaret(position);
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
      setDismissedAt(queryStart);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        <div
          ref={mirrorRef}
          aria-hidden
          className="pointer-events-none absolute forced-colors:hidden inset-0 overflow-hidden rounded-lg border border-transparent px-2.5 py-2 text-base break-words whitespace-pre-wrap md:text-sm dark:bg-input/30"
        >
          {splitByMentions(value, names).map((part, index) =>
            names.includes(part) ? (
              <span key={index} className={MENTION_HIGHLIGHT_CLASS}>
                {part}
              </span>
            ) : (
              part
            )
          )}{' '}
        </div>
        <Textarea
          ref={textareaRef}
          autoFocus={autoFocus}
          onFocus={(event) => {
            if (!autoFocus) return;
            const end = event.currentTarget.value.length;
            event.currentTarget.setSelectionRange(end, end);
          }}
          onScroll={(event) => {
            if (mirrorRef.current)
              mirrorRef.current.scrollTop = event.currentTarget.scrollTop;
          }}
          className="relative bg-transparent text-transparent caret-foreground selection:bg-primary/25 selection:text-transparent dark:bg-transparent forced-colors:text-[CanvasText]"
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
      </div>
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
