'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DEACTIVATED_MESSAGE } from '@/constants/errorMessages';
import { authClient } from '@/lib/authClient';

const BANNED_USER_CODE = 'BANNED_USER';
const TOO_MANY_REQUESTS = 429;
const INVALID_CREDENTIALS = 401;

function getErrorMessage(status: number, code?: string) {
  if (code === BANNED_USER_CODE) return DEACTIVATED_MESSAGE;
  if (status === TOO_MANY_REQUESTS)
    return 'Muitas tentativas. Aguarde um pouco.';
  if (status === INVALID_CREDENTIALS || status === 400)
    return 'E-mail ou senha incorretos.';
  return 'Não foi possível entrar. Tente novamente.';
}

export function EmailSignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function signIn(event: React.FormEvent) {
    event.preventDefault();
    setIsPending(true);
    setErrorMessage(null);
    const { error } = await authClient.signIn.email({ email, password });
    if (error) {
      setErrorMessage(getErrorMessage(error.status, error.code));
      setIsPending(false);
      return;
    }
    router.push('/dashboard');
  }

  return (
    <form onSubmit={signIn} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="sign-in-email" className="text-sm font-medium">
          E-mail
        </label>
        <Input
          id="sign-in-email"
          required
          type="email"
          autoComplete="email"
          aria-invalid={errorMessage ? true : undefined}
          aria-describedby={errorMessage ? 'sign-in-error' : undefined}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="sign-in-password" className="text-sm font-medium">
          Senha
        </label>
        <Input
          id="sign-in-password"
          required
          type="password"
          autoComplete="current-password"
          aria-invalid={errorMessage ? true : undefined}
          aria-describedby={errorMessage ? 'sign-in-error' : undefined}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      {errorMessage && (
        <p id="sign-in-error" role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        Entrar
      </Button>
      <p className="text-xs text-muted-foreground">
        Esqueceu a senha? Fale com um administrador.
      </p>
    </form>
  );
}
