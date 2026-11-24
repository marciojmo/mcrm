'use server';

import { revalidatePath, updateTag } from 'next/cache';
import {
  APP_NAME_CACHE_TAG,
  updateAppName,
} from '@/services/appSettingService';
import { requireAdmin } from '@/services/sessionService';

export async function saveAppName(name: string) {
  await requireAdmin();
  await updateAppName(name);
  updateTag(APP_NAME_CACHE_TAG);
  revalidatePath('/', 'layout');
}
