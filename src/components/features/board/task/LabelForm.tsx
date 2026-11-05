'use client';

import { useState, useTransition } from 'react';
import { ChevronLeftIcon } from 'lucide-react';
import {
  createLabel,
  deleteLabel,
  updateLabel,
} from '@/app/(app)/dashboard/taskActions';
import { LabelChip } from '@/components/features/board/LabelChip';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LABEL_COLORS } from '@/constants/labelColors';
import { cn } from '@/lib/utils';
import type { BoardLabel } from '@/types/board';

interface LabelFormProps {
  label: BoardLabel | null;
  onDone: () => void;
}

export function LabelForm({ label, onDone }: LabelFormProps) {
  const [name, setName] = useState(label?.name ?? '');
  const [color, setColor] = useState(label?.color ?? LABEL_COLORS[0]);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  function run(action: () => Promise<void>) {
    startTransition(async () => {
      await action();
      onDone();
    });
  }

  function save() {
    run(() =>
      label ? updateLabel(label.id, name, color) : createLabel(name, color)
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label="Voltar"
          onClick={onDone}
        >
          <ChevronLeftIcon />
        </Button>
        {label ? 'Editar etiqueta' : 'Criar etiqueta'}
      </div>
      <LabelChip label={{ id: 'preview', name, color }} />
      <label className="flex flex-col gap-1 text-xs font-medium">
        Título
        <Input
          value={name}
          maxLength={200}
          onChange={(event) => setName(event.target.value)}
        />
      </label>
      <div className="grid grid-cols-5 gap-1.5">
        {LABEL_COLORS.map((option) => (
          <button
            key={option}
            type="button"
            aria-label={`Cor ${option}`}
            aria-pressed={option === color}
            style={{ backgroundColor: option }}
            className={cn(
              'h-8 rounded',
              option === color && 'ring-2 ring-foreground ring-offset-2'
            )}
            onClick={() => setColor(option)}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <Button size="sm" disabled={isPending} onClick={save}>
          {label ? 'Salvar' : 'Criar'}
        </Button>
        {label &&
          (isConfirmingDelete ? (
            <Button
              size="sm"
              variant="destructive"
              disabled={isPending}
              onClick={() => run(() => deleteLabel(label.id))}
            >
              Confirmar exclusão
            </Button>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsConfirmingDelete(true)}
            >
              Excluir
            </Button>
          ))}
      </div>
    </div>
  );
}
