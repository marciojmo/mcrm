import { AttachmentItem } from '@/components/features/board/task/AttachmentItem';
import type { TaskAttachment } from '@/types/task';

interface AttachmentsSectionProps {
  attachments: TaskAttachment[];
  onChange: () => Promise<void>;
}

export function AttachmentsSection({
  attachments,
  onChange,
}: AttachmentsSectionProps) {
  if (attachments.length === 0) return null;

  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold">Anexos</h3>
      <ul className="flex flex-col gap-2">
        {attachments.map((attachment) => (
          <AttachmentItem
            key={attachment.id}
            attachment={attachment}
            onChange={onChange}
          />
        ))}
      </ul>
    </section>
  );
}
