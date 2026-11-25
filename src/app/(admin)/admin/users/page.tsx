import { Suspense } from 'react';
import { AdminPage } from '@/components/layouts/AdminPage';
import { CreateUserForm } from '@/components/features/admin/CreateUserForm';
import { UserAccountTable } from '@/components/features/admin/UserAccountTable';
import { listAccountUsers } from '@/services/accountUserService';
import { requireAdmin } from '@/services/sessionService';
import UsersLoading from './loading';

async function Users() {
  await requireAdmin();
  const users = await listAccountUsers();
  return (
    <AdminPage title="Usuários">
      <CreateUserForm />
      <UserAccountTable users={users} />
    </AdminPage>
  );
}

export default function UsersPage() {
  return (
    <Suspense fallback={<UsersLoading />}>
      <Users />
    </Suspense>
  );
}
