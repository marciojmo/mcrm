'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authClient } from '@/lib/authClient';

export function EmailSignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function signIn(event: React.FormEvent) {
    event.preventDefault();
    setIsPending(true);
    setHasError(false);
    const { error } = await authClient.signIn.email({ email, password });
    setIsPending(false);
    if (error) return setHasError(true);
    router.push('/dashboard');
  }

  return (
    <form onSubmit={signIn} className="flex flex-col gap-3">
      <Input
        required
        type="email"
        autoComplete="email"
        aria-label="E-mail"
        placeholder="E-mail"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Input
        required
        type="password"
        autoComplete="current-password"
        aria-label="Senha"
        placeholder="Senha"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      {hasError && (
        <p role="alert" className="text-sm text-destructive">
          E-mail ou senha incorretos.
        </p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        Entrar
      </Button>
    </form>
  );
}
