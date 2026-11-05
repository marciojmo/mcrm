'use client';

import { Button } from '@/components/ui/Button';

interface DashboardErrorProps {
  reset: () => void;
}

export default function DashboardError({ reset }: DashboardErrorProps) {
  return (
    <div className="flex flex-col items-start gap-3 p-8">
      <p>Não foi possível carregar os painéis.</p>
      <Button onClick={reset}>Tentar novamente</Button>
    </div>
  );
}
