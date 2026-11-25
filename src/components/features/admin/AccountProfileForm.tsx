'use client';

import { useState } from 'react';
import { updateUserProfile } from '@/app/(admin)/admin/users/actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { useSafeTransition } from '@/hooks/useSafeTransition';

interface AccountProfileFormProps {
  userId: string;
  name: string;
  email: string;
  isGoogleLinked: boolean;
}

export function AccountProfileForm({
  userId,
  name: initialName,
  email: initialEmail,
  isGoogleLinked,
}: AccountProfileFormProps) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [isEmailTaken, setIsEmailTaken] = useState(false);
  const { isPending, runAction } = useSafeTransition();
  const toast = useToast();
  const isChanged = name !== initialName || email !== initialEmail;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setIsEmailTaken(false);
    let isTaken = false;
    const isSaved = await runAction(async () => {
      ({ isEmailTaken: isTaken } = await updateUserProfile(userId, {
        name,
        email,
      }));
    });
    if (!isSaved) return;
    if (isTaken) return setIsEmailTaken(true);
    toast.add({ title: 'Dados salvos.' });
  }

  return (
    <form onSubmit={submit} className="grid max-w-3xl gap-3 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="account-name" className="text-sm font-medium">
          Nome
        </label>
        <Input
          id="account-name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="account-email" className="text-sm font-medium">
          E-mail
        </label>
        <Input
          id="account-email"
          required
          type="email"
          aria-invalid={isEmailTaken ? true : undefined}
          aria-describedby={isEmailTaken ? 'account-email-error' : undefined}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setIsEmailTaken(false);
          }}
        />
        {isGoogleLinked && (
          <p className="text-xs text-muted-foreground">
            A conta Google vinculada continua vinculada após a troca de e-mail.
          </p>
        )}
        {isEmailTaken && (
          <p
            id="account-email-error"
            role="alert"
            className="text-sm text-destructive"
          >
            Este e-mail já está em uso por outro usuário.
          </p>
        )}
      </div>
      <div>
        <Button type="submit" disabled={isPending || !isChanged}>
          Salvar dados
        </Button>
      </div>
    </form>
  );
}
