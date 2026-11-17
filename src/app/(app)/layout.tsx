import { Suspense } from 'react';
import { UserMenu } from '@/components/features/auth/UserMenu';
import { Sidebar } from '@/components/layouts/Sidebar';
import { listBoards } from '@/services/boardService';
import { isAdminEmail, requireSession } from '@/services/sessionService';

interface AppLayoutProps {
  children: React.ReactNode;
}

async function AppSidebar() {
  const { user } = await requireSession();
  return (
    <Sidebar
      boards={await listBoards(user.id)}
      isAdmin={isAdminEmail(user.email)}
    />
  );
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
      <Suspense
        fallback={<aside className="w-56 shrink-0 border-r bg-sidebar" />}
      >
        <AppSidebar />
      </Suspense>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center justify-end border-b px-4">
          <Suspense>
            <AppHeader />
          </Suspense>
        </header>
        <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      </div>
    </div>
  );
}
