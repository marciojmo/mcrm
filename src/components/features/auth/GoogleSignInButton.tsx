'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { authClient } from '@/lib/authClient';

export function GoogleSignInButton() {
  const [isPending, setIsPending] = useState(false);

  async function signIn() {
    setIsPending(true);
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/dashboard',
      errorCallbackURL: '/?error=denied',
    });
    setIsPending(false);
  }

  return (
    <Button size="lg" className="w-full" onClick={signIn} disabled={isPending}>
      Continuar com o Google
    </Button>
  );
}
