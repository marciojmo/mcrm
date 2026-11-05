'use client';

import { useState, useTransition } from 'react';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface AddTextFormProps {
  addLabel: string;
  placeholder: string;
  onSubmit: (text: string) => Promise<void>;
}

export function AddTextForm({
  addLabel,
  placeholder,
  onSubmit,
}: AddTextFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const [isPending, startTransition] = useTransition();

  function close() {
    setText('');
    setIsOpen(false);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!text.trim()) return;
    startTransition(async () => {
      await onSubmit(text);
      close();
    });
  }

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        className="w-full justify-start"
        onClick={() => setIsOpen(true)}
      >
        <PlusIcon /> {addLabel}
      </Button>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <Input
        autoFocus
        value={text}
        placeholder={placeholder}
        maxLength={200}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => event.key === 'Escape' && close()}
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isPending}>
          Adicionar
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={close}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
