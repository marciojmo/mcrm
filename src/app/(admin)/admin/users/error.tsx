'use client';

import { Button } from '@/components/ui/Button';

interface UsersErrorProps {
  reset: () => void;
}

export default function UsersError({ reset }: UsersErrorProps) {
  return (
    <div className="flex flex-col items-start gap-3 p-6">
      <p>Não foi possível carregar os usuários.</p>
      <Button onClick={reset}>Tentar novamente</Button>
    </div>
  );
}
