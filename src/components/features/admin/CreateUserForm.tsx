'use client';

import { useState } from 'react';
import { createUser } from '@/app/(admin)/admin/users/actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '@/constants/auth';
import { useSafeTransition } from '@/hooks/useSafeTransition';
import { ROLE_SELECT_CLASS } from '@/constants/userRole';
import type { UserRole } from '@/types/accountUser';

export function CreateUserForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const { isPending, runAction } = useSafeTransition();
  const toast = useToast();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const isCreated = await runAction(
      () => createUser({ name, email, password, role }),
      {
        errorMessage:
          'Não foi possível criar o usuário. Verifique se o e-mail já está em uso.',
      }
    );
    if (!isCreated) return;
    setName('');
    setEmail('');
    setPassword('');
    setRole('user');
    toast.add({ title: 'Usuário criado.' });
  }

  return (
    <form
      onSubmit={submit}
      aria-label="Criar usuário"
      className="grid max-w-3xl gap-3 sm:grid-cols-2"
    >
      <Input
        required
        aria-label="Nome"
        placeholder="Nome"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <Input
        required
        type="email"
        aria-label="E-mail"
        placeholder="E-mail"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Input
        required
        type="password"
        autoComplete="new-password"
        aria-label="Senha inicial"
        placeholder={`Senha inicial (mín. ${MIN_PASSWORD_LENGTH} caracteres)`}
        minLength={MIN_PASSWORD_LENGTH}
        maxLength={MAX_PASSWORD_LENGTH}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <select
        aria-label="Papel"
        className={ROLE_SELECT_CLASS}
        value={role}
        onChange={(event) => setRole(event.target.value as UserRole)}
      >
        <option value="user">Usuário</option>
        <option value="admin">Administrador</option>
      </select>
      <div>
        <Button type="submit" disabled={isPending}>
          Criar usuário
        </Button>
      </div>
    </form>
  );
}
