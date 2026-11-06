'use client';

import { useTransition } from 'react';
import { CheckIcon } from 'lucide-react';
import { markMentionSeen } from '@/app/(app)/home/actions';
import { Button } from '@/components/ui/Button';

export function MarkMentionSeenButton({ commentId }: { commentId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Marcar como visto"
      title="Marcar como visto"
      disabled={isPending}
      onClick={() => startTransition(() => markMentionSeen(commentId))}
    >
      <CheckIcon />
    </Button>
  );
}
