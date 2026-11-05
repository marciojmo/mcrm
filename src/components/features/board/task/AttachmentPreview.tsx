'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CloudIcon, FileIcon, LinkIcon } from 'lucide-react';
import { getPreviewUrl } from '@/lib/attachmentPreview';
import { isDriveUrl } from '@/lib/isDriveUrl';
import type { TaskAttachment } from '@/types/task';

interface AttachmentPreviewProps {
  attachment: TaskAttachment;
}

export function AttachmentPreview({ attachment }: AttachmentPreviewProps) {
  const [hasFailed, setHasFailed] = useState(false);
  const previewUrl = getPreviewUrl(attachment);

  if (previewUrl && !hasFailed) {
    return (
      <Image
        src={previewUrl}
        alt={attachment.name}
        width={80}
        height={56}
        unoptimized
        className="h-14 w-20 shrink-0 rounded-md object-cover"
        onError={() => setHasFailed(true)}
      />
    );
  }

  const Icon = !attachment.url
    ? FileIcon
    : isDriveUrl(attachment.url)
      ? CloudIcon
      : LinkIcon;
  return (
    <span className="flex h-14 w-20 shrink-0 items-center justify-center rounded-md bg-muted">
      <Icon className="size-5 text-muted-foreground" />
    </span>
  );
}
