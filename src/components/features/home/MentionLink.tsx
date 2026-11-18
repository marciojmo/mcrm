'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { markMentionSeen } from '@/app/(app)/home/actions';

interface MentionLinkProps {
  commentId: string;
  isSeen: boolean;
  href: string;
  className?: string;
  children: ReactNode;
}

export function MentionLink({
  commentId,
  isSeen,
  href,
  className,
  children,
}: MentionLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={
        isSeen
          ? undefined
          : () => {
              markMentionSeen(commentId).catch(() => {});
            }
      }
    >
      {children}
    </Link>
  );
}
