'use client';

import { Button } from '@/components/ui/Button';

interface HomeErrorProps {
  reset: () => void;
}

export default function HomeError({ reset }: HomeErrorProps) {
  return (
    <div className="flex flex-col items-start gap-3 p-8">
      <p>Não foi possível carregar o início.</p>
      <Button onClick={reset}>Tentar novamente</Button>
    </div>
  );
}
