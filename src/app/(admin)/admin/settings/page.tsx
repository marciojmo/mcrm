import { Suspense } from 'react';
import { AdminPage } from '@/components/layouts/AdminPage';
import { AppNameForm } from '@/components/features/settings/AppNameForm';
import { MaxUploadForm } from '@/components/features/settings/MaxUploadForm';
import { getAppName, getMaxUploadBytes } from '@/services/appSettingService';
import { requireAdmin } from '@/services/sessionService';
import SettingsLoading from './loading';

async function Settings() {
  await requireAdmin();
  const [appName, maxUploadBytes] = await Promise.all([
    getAppName(),
    getMaxUploadBytes(),
  ]);
  return (
    <AdminPage title="Configurações">
      <AppNameForm appName={appName} />
      <MaxUploadForm maxUploadBytes={maxUploadBytes} />
    </AdminPage>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsLoading />}>
      <Settings />
    </Suspense>
  );
}
