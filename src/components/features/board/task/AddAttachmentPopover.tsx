'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { PaperclipIcon } from 'lucide-react';
import { addLinkAttachment } from '@/app/(app)/dashboard/taskActions';
import { Button, buttonVariants } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover';
import { MAX_UPLOAD_BYTES } from '@/constants/storage';

interface AddAttachmentPopoverProps {
  taskId: string;
  onChange: () => Promise<void>;
}

export function AddAttachmentPopover({
  taskId,
  onChange,
}: AddAttachmentPopoverProps) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  function finish() {
    setUrl('');
    setName('');
    setError('');
    setIsOpen(false);
  }

  function upload(file: File) {
    if (file.size > MAX_UPLOAD_BYTES) {
      setError('Arquivo maior que 10 MB.');
      return;
    }
    startTransition(async () => {
      const form = new FormData();
      form.set('taskId', taskId);
      form.set('file', file);
      const response = await fetch('/api/attachments', {
        method: 'POST',
        body: form,
      });
      if (!response.ok) return setError('Não foi possível enviar o arquivo.');
      router.refresh();
      await onChange();
      finish();
    });
  }

  function attachLink(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      try {
        await addLinkAttachment(taskId, url, name);
      } catch {
        return setError('Informe um link válido (http ou https).');
      }
      await onChange();
      finish();
    });
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        className={buttonVariants({ variant: 'outline', size: 'sm' })}
      >
        <PaperclipIcon /> Anexo
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80">
        <div className="flex flex-col gap-3">
          <input
            ref={fileInput}
            type="file"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) upload(file);
              event.target.value = '';
            }}
          />
          <Button
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => fileInput.current?.click()}
          >
            Escolher um arquivo
          </Button>
          <form onSubmit={attachLink} className="flex flex-col gap-2">
            <label className="flex flex-col gap-1 text-xs font-medium">
              Link (inclui Google Drive)
              <Input
                value={url}
                placeholder="https://drive.google.com/..."
                onChange={(event) => setUrl(event.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium">
              Texto para exibição (opcional)
              <Input
                value={name}
                maxLength={200}
                onChange={(event) => setName(event.target.value)}
              />
            </label>
            <Button type="submit" size="sm" disabled={isPending || !url.trim()}>
              Anexar link
            </Button>
          </form>
          {error && (
            <p role="alert" className="text-xs text-destructive">
              {error}
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
