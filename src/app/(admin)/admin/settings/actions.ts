'use server';

import { revalidatePath, updateTag } from 'next/cache';
import {
  APP_SETTINGS_CACHE_TAG,
  updateAppName,
  updateMaxUploadMb,
} from '@/services/appSettingService';
import { requireAdmin } from '@/services/sessionService';

export async function saveAppName(name: string) {
  await requireAdmin();
  await updateAppName(name);
  updateTag(APP_SETTINGS_CACHE_TAG);
  revalidatePath('/', 'layout');
}

export async function saveMaxUploadMb(megabytes: number) {
  await requireAdmin();
  await updateMaxUploadMb(megabytes);
  updateTag(APP_SETTINGS_CACHE_TAG);
  revalidatePath('/', 'layout');
}
