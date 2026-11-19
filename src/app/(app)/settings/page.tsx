import { Suspense } from 'react';
import { AppNameForm } from '@/components/features/settings/AppNameForm';
import { getAppName } from '@/services/appSettingService';
import { isAdminEmail, requireSession } from '@/services/sessionService';
import SettingsLoading from './loading';

async function Settings() {
  const { user } = await requireSession();
  const appName = await getAppName();
  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-xl font-semibold">Configurações</h1>
      {isAdminEmail(user.email) ? (
        <AppNameForm appName={appName} />
      ) : (
        <p className="text-sm text-muted-foreground">
          Nome do aplicativo: {appName}. Somente administradores podem
          alterá-lo.
        </p>
      )}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsLoading />}>
      <Settings />
    </Suspense>
  );
}
