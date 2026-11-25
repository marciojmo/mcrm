import { Suspense } from 'react';
import { UserMenu } from '@/components/features/auth/UserMenu';
import { MobileSidebar } from '@/components/layouts/MobileSidebar';
import { Sidebar } from '@/components/layouts/Sidebar';
import { AppTimeZoneProvider } from '@/components/layouts/AppTimeZoneProvider';
import { env } from '@/config/env';
import { getAppName } from '@/services/appSettingService';
import { hasGoogleAccount } from '@/services/accountUserService';
import { listBoards } from '@/services/boardService';
import { isAdminUser, requireSession } from '@/services/sessionService';

interface AppLayoutProps {
  children: React.ReactNode;
}

async function AppSidebar() {
  const { user } = await requireSession();
  return (
    <Sidebar
      appName={await getAppName()}
      boards={await listBoards(user.id)}
      isAdmin={isAdminUser(user)}
    />
  );
}

async function AppHeader() {
  const { user } = await requireSession();
  return (
    <>
      <MobileSidebar
        appName={await getAppName()}
        boards={await listBoards(user.id)}
        isAdmin={isAdminUser(user)}
      />
      <UserMenu
        name={user.name}
        email={user.email}
        image={user.image ?? null}
        isGoogleLinked={await hasGoogleAccount(user.id)}
      />
    </>
  );
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen">
      <Suspense
        fallback={
          <aside className="hidden w-56 shrink-0 border-r bg-sidebar md:block" />
        }
      >
        <AppSidebar />
      </Suspense>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center justify-end gap-2 border-b px-4">
          <Suspense>
            <AppHeader />
          </Suspense>
        </header>
        <main className="flex min-h-0 flex-1 flex-col">
          <AppTimeZoneProvider timeZone={env.APP_TIME_ZONE}>
            {children}
          </AppTimeZoneProvider>
        </main>
      </div>
    </div>
  );
}
