'use client';

import { Button } from '@/components/ui/Button';

interface MetricsErrorProps {
  reset: () => void;
}

export default function MetricsError({ reset }: MetricsErrorProps) {
  return (
    <div className="flex flex-col items-start gap-3 p-6">
      <p>Não foi possível carregar as métricas.</p>
      <Button onClick={reset}>Tentar novamente</Button>
    </div>
  );
}
