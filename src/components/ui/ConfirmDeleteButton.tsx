'use client';

import { useRef, useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';

interface ConfirmDeleteButtonProps {
  children: ReactNode;
  size?: 'xs' | 'sm';
  isPending?: boolean;
  onConfirm: () => void;
}

export function ConfirmDeleteButton({
  children,
  size = 'xs',
  isPending = false,
  onConfirm,
}: ConfirmDeleteButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const isReturningFocus = useRef(false);

  if (!isConfirming) {
    return (
      <Button
        ref={(node) => {
          if (node && isReturningFocus.current) node.focus();
          isReturningFocus.current = false;
        }}
        variant="ghost"
        size={size}
        onClick={() => setIsConfirming(true)}
      >
        {children}
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap gap-1">
      <Button
        autoFocus
        variant="destructive"
        size={size}
        disabled={isPending}
        onClick={onConfirm}
      >
        Confirmar exclusão
      </Button>
      <Button
        variant="ghost"
        size={size}
        onClick={() => {
          isReturningFocus.current = true;
          setIsConfirming(false);
        }}
      >
        Cancelar
      </Button>
    </div>
  );
}
