import { Suspense } from 'react';
import { UserMenu } from '@/components/features/auth/UserMenu';
import { Sidebar } from '@/components/layouts/Sidebar';
import { requireSession } from '@/services/sessionService';

interface AppLayoutProps {
  children: React.ReactNode;
}

async function AppHeader() {
  const { user } = await requireSession();
  return (
    <UserMenu name={user.name} email={user.email} image={user.image ?? null} />
  );
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex justify-end border-b px-4 py-2">
          <Suspense>
            <AppHeader />
          </Suspense>
        </header>
        <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      </div>
    </div>
  );
}
