'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ExternalLink } from '@/components/ui/ExternalLink';
import { Textarea } from '@/components/ui/Textarea';
import { MAX_DESCRIPTION_LENGTH } from '@/constants/task';
import { linkify } from '@/lib/linkify';

const PLACEHOLDER = 'Adicione uma descrição';

interface TaskDescriptionProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
}

export function TaskDescription({
  value,
  onChange,
  onSave,
}: TaskDescriptionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const hasEdited = useRef(false);
  const hasValue = value.trim().length > 0;

  useEffect(() => {
    if (isEditing) hasEdited.current = true;
    else if (hasEdited.current && document.activeElement === document.body)
      editButtonRef.current?.focus();
  }, [isEditing]);

  return (
    <div className="flex flex-col gap-1.5 text-sm">
      <div className="flex min-h-7 items-center justify-between">
        <span className="font-semibold">Descrição</span>
        {hasValue && !isEditing && (
          <Button
            ref={editButtonRef}
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            Editar
          </Button>
        )}
      </div>
      {isEditing ? (
        <Textarea
          autoFocus
          rows={5}
          maxLength={MAX_DESCRIPTION_LENGTH}
          value={value}
          placeholder={PLACEHOLDER}
          aria-label="Descrição"
          onFocus={(event) =>
            event.currentTarget.setSelectionRange(value.length, value.length)
          }
          onChange={(event) => onChange(event.target.value)}
          onBlur={() => {
            setIsEditing(false);
            onSave();
          }}
        />
      ) : hasValue ? (
        <div
          className="cursor-text rounded-lg px-2.5 py-2 break-words whitespace-pre-wrap hover:bg-muted"
          onClick={(event) => {
            const isLink = (event.target as HTMLElement).closest('a');
            const hasSelection = Boolean(window.getSelection()?.toString());
            if (!isLink && !hasSelection) setIsEditing(true);
          }}
        >
          {linkify(value).map((segment, index) =>
            segment.isLink ? (
              <ExternalLink key={index} href={segment.text} />
            ) : (
              segment.text
            )
          )}
        </div>
      ) : (
        <button
          ref={editButtonRef}
          type="button"
          className="min-h-16 rounded-lg border border-input px-2.5 py-2 text-left text-muted-foreground outline-none hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          onClick={() => setIsEditing(true)}
        >
          {PLACEHOLDER}
        </button>
      )}
    </div>
  );
}
