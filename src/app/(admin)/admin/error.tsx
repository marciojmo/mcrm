'use client';

import { Button } from '@/components/ui/Button';

interface AdminErrorProps {
  reset: () => void;
}

export default function AdminError({ reset }: AdminErrorProps) {
  return (
    <div className="flex flex-col items-start gap-3 p-6">
      <p>Não foi possível carregar o relatório.</p>
      <Button onClick={reset}>Tentar novamente</Button>
    </div>
  );
}
