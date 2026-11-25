'use client';

import { useState } from 'react';
import { resetUserPassword } from '@/app/(admin)/admin/users/actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '@/constants/auth';
import { useSafeTransition } from '@/hooks/useSafeTransition';

interface AccountPasswordFormProps {
  userId: string;
}

export function AccountPasswordForm({ userId }: AccountPasswordFormProps) {
  const [password, setPassword] = useState('');
  const { isPending, runAction } = useSafeTransition();
  const toast = useToast();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const isReset = await runAction(() => resetUserPassword(userId, password));
    if (!isReset) return;
    setPassword('');
    toast.add({ title: 'Senha redefinida.' });
  }

  return (
    <form onSubmit={submit} className="flex max-w-sm flex-col gap-1.5">
      <label htmlFor="account-password" className="text-sm font-medium">
        Nova senha
      </label>
      <div className="flex gap-2">
        <Input
          id="account-password"
          required
          type="password"
          autoComplete="new-password"
          placeholder={`Mín. ${MIN_PASSWORD_LENGTH} caracteres`}
          minLength={MIN_PASSWORD_LENGTH}
          maxLength={MAX_PASSWORD_LENGTH}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Button type="submit" disabled={isPending}>
          Redefinir senha
        </Button>
      </div>
    </form>
  );
}
