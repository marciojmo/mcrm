'use client';

import { Button } from '@/components/ui/Button';

interface SettingsErrorProps {
  reset: () => void;
}

export default function SettingsError({ reset }: SettingsErrorProps) {
  return (
    <div className="flex flex-col items-start gap-3 p-6">
      <p>Não foi possível carregar as configurações.</p>
      <Button onClick={reset}>Tentar novamente</Button>
    </div>
  );
}
