import { Suspense } from 'react';
import { CreateUserForm } from '@/components/features/admin/CreateUserForm';
import { UserAccountTable } from '@/components/features/admin/UserAccountTable';
import { listAccountUsers } from '@/services/accountUserService';
import { requireAdmin } from '@/services/sessionService';
import UsersLoading from './loading';

async function Users() {
  await requireAdmin();
  const users = await listAccountUsers();
  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold">Usuários</h1>
      <CreateUserForm />
      <UserAccountTable users={users} />
    </div>
  );
}

export default function UsersPage() {
  return (
    <Suspense fallback={<UsersLoading />}>
      <Users />
    </Suspense>
  );
}
