'use client';

import { useState } from 'react';
import { saveAppName } from '@/app/(admin)/admin/settings/actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { APP_NAME_MAX_LENGTH } from '@/constants/appName';
import { useSafeTransition } from '@/hooks/useSafeTransition';

interface AppNameFormProps {
  appName: string;
}

export function AppNameForm({ appName }: AppNameFormProps) {
  const [name, setName] = useState(appName);
  const { isPending, runAction } = useSafeTransition();
  const toast = useToast();

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    runAction(async () => {
      await saveAppName(name);
      toast.add({ title: 'Nome salvo.' });
    });
  }

  return (
    <form onSubmit={submit} className="flex max-w-sm flex-col gap-2">
      <label htmlFor="app-name" className="text-sm font-medium">
        Nome do aplicativo
      </label>
      <Input
        id="app-name"
        value={name}
        maxLength={APP_NAME_MAX_LENGTH}
        onChange={(event) => setName(event.target.value)}
      />
      <div className="flex items-center gap-2">
        <Button type="submit" size="sm" disabled={isPending || !name.trim()}>
          Salvar
        </Button>
        <span className="text-xs text-muted-foreground">
          {name.length}/{APP_NAME_MAX_LENGTH}
        </span>
      </div>
    </form>
  );
}
