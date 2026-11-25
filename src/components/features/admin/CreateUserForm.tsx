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
    let isEmailTaken = false;
    const isCreated = await runAction(
      async () => {
        ({ isEmailTaken } = await createUser({ name, email, password, role }));
      },
      { errorMessage: 'Não foi possível criar o usuário. Tente novamente.' }
    );
    if (!isCreated) return;
    if (isEmailTaken) {
      toast.add({ title: 'Este e-mail já está em uso.', priority: 'high' });
      return;
    }
    setName('');
    setEmail('');
    setPassword('');
    setRole('user');
    toast.add({ title: 'Usuário criado.' });
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-base font-semibold">Novo usuário</h2>
      <form onSubmit={submit} className="grid max-w-3xl gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="new-user-name" className="text-sm font-medium">
            Nome
          </label>
          <Input
            id="new-user-name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="new-user-email" className="text-sm font-medium">
            E-mail
          </label>
          <Input
            id="new-user-email"
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="new-user-password" className="text-sm font-medium">
            Senha inicial
          </label>
          <Input
            id="new-user-password"
            required
            type="password"
            autoComplete="new-password"
            placeholder={`Mínimo de ${MIN_PASSWORD_LENGTH} caracteres`}
            minLength={MIN_PASSWORD_LENGTH}
            maxLength={MAX_PASSWORD_LENGTH}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="new-user-role" className="text-sm font-medium">
            Papel
          </label>
          <select
            id="new-user-role"
            className={ROLE_SELECT_CLASS}
            value={role}
            onChange={(event) => setRole(event.target.value as UserRole)}
          >
            <option value="user">Usuário</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <div>
          <Button type="submit" disabled={isPending}>
            Criar usuário
          </Button>
        </div>
      </form>
    </section>
  );
}
