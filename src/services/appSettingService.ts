import { cacheTag } from 'next/cache';
import { APP_NAME_MAX_LENGTH, DEFAULT_APP_NAME } from '@/constants/appName';
import {
  BYTES_PER_MB,
  DEFAULT_MAX_UPLOAD_BYTES,
  MAX_UPLOAD_MB,
  MIN_UPLOAD_MB,
} from '@/constants/storage';
import { prisma } from '@/lib/prisma';

export const APP_SETTINGS_CACHE_TAG = 'app-settings';

export async function getAppName() {
  'use cache';
  cacheTag(APP_SETTINGS_CACHE_TAG);
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

export async function getMaxUploadBytes() {
  'use cache';
  cacheTag(APP_SETTINGS_CACHE_TAG);
  const setting = await prisma.appSetting.findUnique({
    where: { id: 'app' },
    select: { maxUploadBytes: true },
  });
  return setting?.maxUploadBytes ?? DEFAULT_MAX_UPLOAD_BYTES;
}

export async function updateMaxUploadMb(megabytes: number) {
  if (
    !Number.isInteger(megabytes) ||
    megabytes < MIN_UPLOAD_MB ||
    megabytes > MAX_UPLOAD_MB
  )
    throw new Error('Invalid upload limit');
  const maxUploadBytes = megabytes * BYTES_PER_MB;
  await prisma.appSetting.upsert({
    where: { id: 'app' },
    create: { id: 'app', maxUploadBytes },
    update: { maxUploadBytes },
  });
}
