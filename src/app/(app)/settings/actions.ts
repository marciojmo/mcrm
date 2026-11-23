'use server';

import { revalidatePath, updateTag } from 'next/cache';
import {
  APP_NAME_CACHE_TAG,
  updateAppName,
} from '@/services/appSettingService';
import { isAdminEmail, requireSession } from '@/services/sessionService';

export async function saveAppName(name: string) {
  const { user } = await requireSession();
  if (!isAdminEmail(user.email)) throw new Error('Forbidden');
  await updateAppName(name);
  updateTag(APP_NAME_CACHE_TAG);
  revalidatePath('/', 'layout');
}
