'use client';

import { useState } from 'react';
import { saveMaxUploadMb } from '@/app/(admin)/admin/settings/actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import {
  BYTES_PER_MB,
  MAX_UPLOAD_MB,
  MIN_UPLOAD_MB,
} from '@/constants/storage';
import { useSafeTransition } from '@/hooks/useSafeTransition';

interface MaxUploadFormProps {
  maxUploadBytes: number;
}

export function MaxUploadForm({ maxUploadBytes }: MaxUploadFormProps) {
  const [megabytes, setMegabytes] = useState(
    String(maxUploadBytes / BYTES_PER_MB)
  );
  const { isPending, runAction } = useSafeTransition();
  const toast = useToast();
  const value = Number(megabytes);
  const isValid =
    megabytes !== '' &&
    Number.isInteger(value) &&
    value >= MIN_UPLOAD_MB &&
    value <= MAX_UPLOAD_MB;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!isValid) return;
    runAction(async () => {
      await saveMaxUploadMb(value);
      toast.add({ title: 'Limite de upload salvo.' });
    });
  }

  return (
    <form onSubmit={submit} className="flex max-w-sm flex-col gap-2">
      <label htmlFor="max-upload" className="text-sm font-medium">
        Tamanho máximo de upload (MB)
      </label>
      <Input
        id="max-upload"
        type="number"
        inputMode="numeric"
        step={1}
        min={MIN_UPLOAD_MB}
        max={MAX_UPLOAD_MB}
        value={megabytes}
        onChange={(event) => setMegabytes(event.target.value)}
      />
      <div className="flex items-center gap-2">
        <Button type="submit" size="sm" disabled={isPending || !isValid}>
          Salvar
        </Button>
        <span className="text-xs text-muted-foreground">
          Entre {MIN_UPLOAD_MB} e {MAX_UPLOAD_MB} MB
        </span>
      </div>
    </form>
  );
}
