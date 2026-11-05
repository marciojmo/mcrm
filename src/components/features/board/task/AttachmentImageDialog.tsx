import Image from 'next/image';
import { DownloadIcon } from 'lucide-react';
import { buttonVariants } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';

interface AttachmentImageDialogProps {
  name: string;
  imageUrl: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function AttachmentImageDialog({
  name,
  imageUrl,
  isOpen,
  onOpenChange,
}: AttachmentImageDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-auto max-w-[90vw] flex-col gap-3 sm:max-w-[90vw]">
        <DialogHeader className="pr-8">
          <DialogTitle className="truncate">{name}</DialogTitle>
        </DialogHeader>
        <Image
          src={imageUrl}
          alt={name}
          width={1600}
          height={1200}
          unoptimized
          className="max-h-[65vh] w-auto self-center rounded-md object-contain"
        />
        <a
          href={imageUrl}
          download={name}
          className={buttonVariants({ variant: 'outline', size: 'sm' })}
        >
          <DownloadIcon /> Baixar
        </a>
      </DialogContent>
    </Dialog>
  );
}
