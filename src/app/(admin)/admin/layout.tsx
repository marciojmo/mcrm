import { Suspense } from 'react';
import { AdminSidebar } from '@/components/features/admin/AdminSidebar';
import { UserMenu } from '@/components/features/auth/UserMenu';
import { hasGoogleAccount } from '@/services/accountUserService';
import { requireAdmin } from '@/services/sessionService';

interface AdminLayoutProps {
  children: React.ReactNode;
}

async function AdminHeader() {
  const { user } = await requireAdmin();
  return (
    <UserMenu
      name={user.name}
      email={user.email}
      image={user.image ?? null}
      isGoogleLinked={await hasGoogleAccount(user.id)}
    />
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center justify-between border-b px-4">
          <span className="text-sm font-medium">
            Administração da instância
          </span>
          <Suspense>
            <AdminHeader />
          </Suspense>
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
