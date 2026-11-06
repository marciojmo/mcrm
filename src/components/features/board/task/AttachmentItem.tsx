'use client';

import { useState } from 'react';
import { DownloadIcon, Trash2Icon } from 'lucide-react';
import { AttachmentImageDialog } from '@/components/features/board/task/AttachmentImageDialog';
import { AttachmentPreview } from '@/components/features/board/task/AttachmentPreview';
import { DeleteAttachmentDialog } from '@/components/features/board/task/DeleteAttachmentDialog';
import { Button, buttonVariants } from '@/components/ui/Button';
import { getImageUrl } from '@/lib/attachmentPreview';
import { isDriveUrl } from '@/lib/isDriveUrl';
import type { TaskAttachment } from '@/types/task';

interface AttachmentItemProps {
  attachment: TaskAttachment;
  onChange: () => Promise<void>;
}

function formatSize(bytes: number) {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AttachmentItem({ attachment, onChange }: AttachmentItemProps) {
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const imageUrl = getImageUrl(attachment);
  const href = attachment.url ?? `/api/attachments/${attachment.id}`;
  const isDrive = attachment.url ? isDriveUrl(attachment.url) : false;
  const linkProps = {
    href,
    target: attachment.url ? '_blank' : undefined,
    rel: 'noopener noreferrer',
  };

  return (
    <li className="flex items-center gap-3 rounded-lg bg-muted/50 p-2 text-sm">
      {imageUrl ? (
        <button
          type="button"
          aria-label={`Visualizar ${attachment.name}`}
          onClick={() => setIsImageOpen(true)}
        >
          <AttachmentPreview attachment={attachment} />
        </button>
      ) : (
        <a {...linkProps} aria-label={`Abrir ${attachment.name}`}>
          <AttachmentPreview attachment={attachment} />
        </a>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <button
          className="truncate font-medium hover:underline text-left"
          aria-label={`Visualizar ${attachment.name}`}
          onClick={() => setIsImageOpen(true)}
        >
          {attachment.name}
        </button>
        <span className="text-xs text-muted-foreground">
          {isDrive && 'Google Drive'}
          {attachment.size !== null && formatSize(attachment.size)}
        </span>
      </div>
      {!attachment.url && (
        <a
          href={href}
          download={attachment.name}
          aria-label="Baixar anexo"
          className={buttonVariants({ variant: 'ghost', size: 'icon-xs' })}
        >
          <DownloadIcon />
        </a>
      )}
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label="Remover anexo"
        onClick={() => setIsDeleting(true)}
      >
        <Trash2Icon />
      </Button>
      {imageUrl && (
        <AttachmentImageDialog
          name={attachment.name}
          imageUrl={imageUrl}
          isOpen={isImageOpen}
          onOpenChange={setIsImageOpen}
        />
      )}
      <DeleteAttachmentDialog
        attachmentId={attachment.id}
        name={attachment.name}
        isOpen={isDeleting}
        onOpenChange={setIsDeleting}
        onDeleted={onChange}
      />
    </li>
  );
}
