'use client';

import { CheckIcon } from 'lucide-react';
import { markMentionSeen } from '@/app/(app)/home/actions';
import { Button } from '@/components/ui/Button';
import { useSafeTransition } from '@/hooks/useSafeTransition';

export function MarkMentionSeenButton({ commentId }: { commentId: string }) {
  const { isPending, runAction } = useSafeTransition();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Marcar como visto"
      title="Marcar como visto"
      disabled={isPending}
      onClick={() => runAction(() => markMentionSeen(commentId))}
    >
      <CheckIcon />
    </Button>
  );
}
