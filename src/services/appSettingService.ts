import { cacheTag } from 'next/cache';
import { APP_NAME_MAX_LENGTH, DEFAULT_APP_NAME } from '@/constants/appName';
import { prisma } from '@/lib/prisma';

export const APP_NAME_CACHE_TAG = 'app-name';

export async function getAppName() {
  'use cache';
  cacheTag(APP_NAME_CACHE_TAG);
  const setting = await prisma.appSetting.findUnique({
    where: { id: 'app' },
    select: { appName: true },
  });
  return setting?.appName ?? DEFAULT_APP_NAME;
}

export async function updateAppName(name: string) {
  const appName = name.trim();
  if (appName.length < 1 || appName.length > APP_NAME_MAX_LENGTH)
    throw new Error('Invalid app name');
  await prisma.appSetting.upsert({
    where: { id: 'app' },
    create: { id: 'app', appName },
    update: { appName },
  });
}
