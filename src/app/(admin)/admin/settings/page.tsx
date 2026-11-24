import { Suspense } from 'react';
import { AppNameForm } from '@/components/features/settings/AppNameForm';
import { getAppName } from '@/services/appSettingService';
import { requireAdmin } from '@/services/sessionService';
import SettingsLoading from './loading';

async function Settings() {
  await requireAdmin();
  const appName = await getAppName();
  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-xl font-semibold">Configurações</h1>
      <AppNameForm appName={appName} />
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
